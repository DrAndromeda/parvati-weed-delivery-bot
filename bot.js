// 🌿 Parvati Premium Botanic — v5.5 Premium Edition
// Telegram-safe | Age 18+ | Premium delivery | Discreet
// @karmadharma_bot

const { Telegraf, Markup } = require('telegraf');
const { products, categories } = require('./products');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ADMIN_ID = Number(process.env.ADMIN_ID || '237228075');

// ─── PREMIUM CONFIG ───
const CONFIG = {
  botName: 'Parvati Premium Botanic',
  tagline: { en: 'Premium Botanical Collection', ru: 'Премиум Ботаническая Коллекция' },
  phone: '0812345678',
  currency: 'THB',
  loyaltyBonus: 0.05,         // 5% cashback
  welcomeImage: 'product_premium.png',
  defaultImage: 'product_default.png',
};

const DELIVERY = [
  { id: 'bangkok',     en: '📍 Bangkok — Express',      ru: '📍 Бангкок — Экспресс',       price: 100 },
  { id: 'phuket',      en: '📍 Phuket — Courier',       ru: '📍 Пхукет — Курьер',          price: 300 },
  { id: 'samui',       en: '📍 Koh Samui — Premium',    ru: '📍 Самуи — Премиум',          price: 400 },
  { id: 'phangan',     en: '📍 Koh Phangan — Priority', ru: '📍 Панган — Приоритет',       price: 500 },
  { id: 'other',       en: '📍 Other — Thailand Post',  ru: '📍 Другие — Почта Таиланда',   price: 300 },
];

const SIZES = [
  { id:'joint',  label:'🚬 Joint',  wt:1 },
  { id:'gram',   label:'🌱 1g',     wt:1 },
  { id:'eighth', label:'🔥 3.5g',   wt:3.5 },
  { id:'fiveg',  label:'⭐ 5g',     wt:5 },
  { id:'quarter',label:'🌈 7g',     wt:7 },
  { id:'teng',   label:'💫 10g',    wt:10 },
  { id:'half',   label:'💎 14g',    wt:14 },
  { id:'ounce',  label:'👑 28g',    wt:28 },
];

const SIZE_KEY = {
  joint:'price_joint', gram:'price_gram', eighth:'price_8th',
  fiveg:'price_8th', quarter:'price_quarter', teng:'price_quarter',
  half:'price_half', ounce:'price_ounce'
};

function getPrice(p, sizeId) {
  const s = SIZES.find(x => x.id === sizeId);
  if (!s) return 0;
  const key = SIZE_KEY[sizeId];
  const base = p[key];
  if (['fiveg','teng'].includes(sizeId)) return Math.round(p.price_gram * s.wt);
  return base || Math.round(p.price_gram * s.wt);
}

// ─── USER STATE ───
const user = {};
function lang(c) { return user[c]?.lang || 'en'; }
function t(c, en, ru) { return lang(c) === 'en' ? en : ru; }
function adult(c) { return user[c]?.adult === true; }

function cartTotal(c) {
  return (user[c]?.cart || []).reduce((sum, i) => {
    const p = products.find(x => x.id === i.id);
    if (!p) return sum;
    return sum + getPrice(p, i.size) * i.qty;
  }, 0);
}

function loyaltyPoints(c) {
  return Math.floor(cartTotal(c) * CONFIG.loyaltyBonus);
}

function cartPreview(c) {
  const items = user[c]?.cart || [];
  if (!items.length) return null;
  let text = '🛒 *PREMIUM CART*\n═══════════════════\n\n';
  let total = 0;
  items.forEach((i, idx) => {
    const p = products.find(x => x.id === i.id);
    if (p) {
      const price = getPrice(p, i.size);
      const sum = price * i.qty;
      total += sum;
      text += `▸ *${p.name_en}* ${SIZES.find(s=>s.id===i.size)?.label||''}\n`;
      text += `  ×${i.qty} = ${sum.toLocaleString()} ${CONFIG.currency}\n\n`;
    }
  });
  text += `═══════════════════\n💰 *Total: ${total.toLocaleString()} ${CONFIG.currency}*\n`;
  return text;
}

// ─── MENU ───
function premiumMenu(c) {
  const items = user[c]?.cart || [];
  const badge = items.length ? ` (${items.reduce((s,i)=>s+i.qty,0)})` : '';
  return {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback('🛍️ BROWSE COLLECTION', 'shop')],
        [Markup.button.callback(`🛒 CART${badge}`, 'cart'), Markup.button.callback('✨ FAQ', 'faq')],
        [Markup.button.callback('🌍 EN / RU', 'lang_menu')],
      ]
    }
  };
}

// ─── IMAGE HELPER ───
function img(name) {
  const p = path.join(__dirname, name);
  return fs.existsSync(p) ? { source: p } : null;
}

// =====================================================
//  BOT
// =====================================================
const bot = new Telegraf(BOT_TOKEN);

// ─────── AGE VERIFICATION ───────
bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  const photo = img(CONFIG.welcomeImage);
  const caption = `🌿 *${CONFIG.botName}* 🌿\n\n━━━━━━━━━━━━━━━━━━━\n*${CONFIG.tagline.en}* / *${CONFIG.tagline.ru}*\n━━━━━━━━━━━━━━━━━━━\n\nDiscreet delivery across Thailand 🇹🇭\n\n⚠️ *Age Verification Required*`;

  const buttons = {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback('✅ I am 18+ / Мне есть 18 ✅', 'adult_yes')],
        [Markup.button.callback('❌ I am under 18 / Мне нет 18', 'adult_no')],
      ]
    }
  };

  if (photo) {
    await ctx.replyWithPhoto(photo, { caption, parse_mode: 'Markdown', ...buttons });
  } else {
    await ctx.reply(caption, { parse_mode: 'Markdown', ...buttons });
  }
});

bot.action('adult_yes', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!user[chatId]) user[chatId] = {};
  user[chatId].adult = true;

  await ctx.editMessageText(
    '✅ *ACCESS GRANTED* ✅\n\n━━━━━━━━━━━━━━━━━━━\nChoose your language:\n\n🇬🇧 English — Premium Botanic Collection\n🇷🇺 Русский — Премиум Ботаническая Коллекция\n━━━━━━━━━━━━━━━━━━━',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('🇬🇧 English', 'lang_en')],
          [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
        ]
      }
    }
  );
});

bot.action('adult_no', async (ctx) => {
  await ctx.editMessageText(
    '⛔ *ACCESS DENIED*\n\nThis service is for adults 18+ only.\nДоступ запрещён. Только для лиц старше 18 лет.',
    { parse_mode: 'Markdown' }
  );
});

// ─────── LANGUAGE ───────
async function showWelcome(chatId, ctx, edit = true) {
  const photo = img(CONFIG.welcomeImage);
  const text = `🌿 *${CONFIG.botName}* 🌿\n\n━━━━━━━━━━━━━━━━━━━\n⭐ *PREMIUM BOTANICAL COLLECTION* ⭐\n━━━━━━━━━━━━━━━━━━━\n\n🏆 Curated selection of premium botanicals\n📦 Discreet unmarked packaging\n🚀 Express delivery 1-3 hrs (Bangkok)\n💎 Loyalty rewards for regular clients\n\n*Welcome to the club.* 👇`;

  if (edit) {
    await ctx.editMessageText(text, { parse_mode: 'Markdown', ...premiumMenu(chatId) });
  } else if (photo) {
    await ctx.replyWithPhoto(photo, { caption: text, parse_mode: 'Markdown', ...premiumMenu(chatId) });
  } else {
    await ctx.reply(text, { parse_mode: 'Markdown', ...premiumMenu(chatId) });
  }
}

bot.action('lang_en', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!adult(chatId)) return;
  user[chatId] = { ...user[chatId], lang: 'en', cart: user[chatId]?.cart || [] };
  await showWelcome(chatId, ctx, true);
});

bot.action('lang_ru', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!adult(chatId)) return;
  user[chatId] = { ...user[chatId], lang: 'ru', cart: user[chatId]?.cart || [] };
  
  const text = `🌿 *${CONFIG.botName}* 🌿\n\n━━━━━━━━━━━━━━━━━━━\n⭐ *ПРЕМИУМ БОТАНИЧЕСКАЯ КОЛЛЕКЦИЯ* ⭐\n━━━━━━━━━━━━━━━━━━━\n\n🏆 Отборный ассортимент премиум растений\n📦 Дискретная упаковка без маркировки\n🚀 Экспресс доставка 1-3 часа (Бангкок)\n💎 Бонусы лояльности для постоянных\n\n*Добро пожаловать в клуб.* 👇`;
  
  await ctx.editMessageText(text, { parse_mode: 'Markdown', ...premiumMenu(chatId) });
});

bot.action('lang_menu', async (ctx) => {
  await ctx.editMessageText('🌍 *LANGUAGE / ЯЗЫК*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback('🇬🇧 English', 'lang_en'), Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
      ]
    }
  });
});

// ─────── SHOP ───────
bot.action('shop', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!adult(chatId)) return;
  
  const rows = categories.map(c => [Markup.button.callback(`✦ ${c.name_en}`, `cat_${c.id}`)]);
  rows.push([Markup.button.callback('🔙 BACK', 'back')]);
  
  await ctx.editMessageText(
    '🛍️ *PREMIUM COLLECTION*\n━━━━━━━━━━━━━━━━━━━\nChoose category:',
    { parse_mode: 'Markdown', reply_markup: { inline_keyboard: rows } }
  );
});

categories.forEach(cat => {
  bot.action(`cat_${cat.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    if (!adult(chatId)) return;
    
    const pp = products.filter(p => p.cat === cat.id);
    // Show in groups of 1 per row for premium feel
    const rows = pp.map(p => [
      Markup.button.callback(`🏆 ${p.grade || 'PREMIUM'} — ${p.name_en}`, `view_${p.id}`)
    ]);
    rows.push([Markup.button.callback('🔙 BACK', 'shop')]);
    
    await ctx.editMessageText(
      `━━ *${cat.name_en}* ━━\n\n${t(chatId, 'Select product:', 'Выберите:')}`,
      { reply_markup: { inline_keyboard: rows } }
    );
  });
});

// ─────── PRODUCT VIEW ───────
products.forEach(p => {
  bot.action(`view_${p.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    if (!adult(chatId)) return;
    
    const isEn = lang(chatId) === 'en';
    let text = `┏━━━━━━━━━━━━━━━━━━━┓\n`;
    text += `┃  ✦ *${p.name_en}* ✦\n`;
    text += `┃  🏆 ${p.grade}\n`;
    text += `┃  🌸 ${p.type || 'Premium'}\n`;
    text += `┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
    text += isEn ? p.description_en : p.description_ru;
    text += `\n\n✨ ${(p.effects || []).join(' · ')}`;
    text += `\n\n📦 Stock: ${p.stock || 'Available'}g\n`;
    text += `━━━━━━━━━━━━━━━\n💰 *PRICE LIST*\n`;
    SIZES.forEach(s => text += `${fmtSize(p, s.id)}\n`);
    text += `━━━━━━━━━━━━━━━`;

    const sb = SIZES.map(s => Markup.button.callback(`${s.label} ${getPrice(p,s.id)} ${CONFIG.currency}`, `add_${p.id}_${s.id}`));
    const rows = [];
    for (let i=0; i<sb.length; i+=2) rows.push(sb.slice(i,i+2));
    rows.push([
      Markup.button.callback('🔙 BACK', `cat_${p.cat}`),
      Markup.button.callback('🛒 CART', 'cart'),
    ]);

    await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: rows } });
  });
});

function fmtSize(p, sizeId) {
  const s = SIZES.find(x => x.id === sizeId);
  return `${s.label.padEnd(12)} ${getPrice(p,sizeId).toString().padStart(5)} ${CONFIG.currency}`;
}

// ─────── ADD TO CART ───────
products.forEach(p => {
  SIZES.forEach(s => {
    bot.action(`add_${p.id}_${s.id}`, async (ctx) => {
      const chatId = ctx.chat.id;
      if (!adult(chatId)) return;
      if (!user[chatId]) user[chatId] = { adult:true, lang:'en', cart:[] };
      if (!user[chatId].cart) user[chatId].cart = [];
      
      const existing = user[chatId].cart.find(i => i.id === p.id && i.size === s.id);
      if (existing) existing.qty += 1;
      else user[chatId].cart.push({ id: p.id, size: s.id, qty: 1 });
      
      await ctx.answerCbQuery(`✅ ${p.name_en} ${SIZES.find(x=>x.id===s.id)?.label||''} added! +${CONFIG.loyaltyBonus*100}% points`);
    });
  });
});

// ─────── CART ───────
bot.action('cart', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!adult(chatId)) return;
  
  const text = cartPreview(chatId);
  if (!text) {
    await ctx.editMessageText(
      '🛒 *CART IS EMPTY*\n\nBrowse our premium collection 👇',
      { parse_mode: 'Markdown', ...premiumMenu(chatId) }
    );
    return;
  }

  const bonus = loyaltyPoints(chatId);
  let fullText = text + `🎁 *Loyalty bonus: +${bonus.toLocaleString()} ${CONFIG.currency}*\n━━━━━━━━━━━━━━━━━━━\n\n📍 Select delivery:`;

  const delButtons = DELIVERY.map(r => [
    Markup.button.callback(`${r.en} — ${r.price} ${CONFIG.currency}`, `deliver_${r.id}`)
  ]);
  delButtons.push([
    Markup.button.callback('🛍️ CONTINUE', 'shop'),
    Markup.button.callback('🗑️ CLEAR', 'clear_cart')
  ]);

  await ctx.editMessageText(fullText, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: delButtons }
  });
});

bot.action('clear_cart', async (ctx) => {
  const chatId = ctx.chat.id;
  if (user[chatId]) user[chatId].cart = [];
  await ctx.editMessageText('🗑️ *Cart cleared*', {
    parse_mode: 'Markdown', ...premiumMenu(chatId)
  });
});

// ─────── DELIVERY ───────
DELIVERY.forEach(r => {
  bot.action(`deliver_${r.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    if (!adult(chatId)) return;
    user[chatId].delivery = r;
    
    const sub = cartTotal(chatId);
    const total = sub + r.price;
    const bonus = Math.floor(total * CONFIG.loyaltyBonus);
    
    const text = `━━━━━━━━━━━━━━━━━━━\n✅ *ORDER SUMMARY*\n━━━━━━━━━━━━━━━━━━━\n\n📦 Subtotal: ${sub.toLocaleString()} ${CONFIG.currency}\n📍 ${r.en}: +${r.price} ${CONFIG.currency}\n💰 *TOTAL: ${total.toLocaleString()} ${CONFIG.currency}*\n🎁 +${bonus.toLocaleString()} loyalty points\n━━━━━━━━━━━━━━━━━━━\n\n💳 *Choose payment:*`;

    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('🇹🇭 PromptPay QR', 'pay_qr')],
          [Markup.button.callback('💵 Cash to courier', 'pay_cash')],
          [Markup.button.callback('₿ Crypto USDT/BTC', 'pay_crypto')],
          [Markup.button.callback('❌ CANCEL', 'cart')]
        ]
      }
    });
  });
});

// ─────── PAYMENTS ───────
bot.action('pay_qr', async (ctx) => {
  const chatId = ctx.chat.id;
  const sub = cartTotal(chatId);
  const total = sub + (user[chatId]?.delivery?.price || 100);
  const qrUrl = `https://promptpay.io/${CONFIG.phone}/${total}.png`;

  await ctx.editMessageText(
    t(chatId,
      `💳 *PromptPay QR*\nAmount: ${total.toLocaleString()} THB`,
      `💳 *PromptPay QR*\nСумма: ${total.toLocaleString()} THB`
    ),
    { parse_mode: 'Markdown' }
  );

  try {
    await ctx.replyWithPhoto({ url: qrUrl }, {
      caption: t(chatId,
        `📱 Scan QR to pay ${total.toLocaleString()} THB\nThen tap ✅ CONFIRM`,
        `📱 Сканируйте QR для оплаты ${total.toLocaleString()} THB\nЗатем нажмите ✅ ПОДТВЕРДИТЬ`
      ),
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('✅ CONFIRM / ПОДТВЕРДИТЬ', 'confirm')],
          [Markup.button.callback('❌ CANCEL', 'back')]
        ]
      }
    });
  } catch(e) {
    await ctx.reply(
      `QR: ${qrUrl}\n${t(chatId,'Then confirm:','Затем подтвердите:')}`,
      {
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback('✅ CONFIRM', 'confirm')],
            [Markup.button.callback('❌ CANCEL', 'back')]
          ]
        }
      }
    );
  }
});

bot.action('pay_cash', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText(
    t(chatId,
      '💵 *CASH TO COURIER*\n\nPay in cash when order arrives.\nNo prepayment needed.',
      '💵 *НАЛИЧНЫЕ КУРЬЕРУ*\n\nОплата наличными при получении.\nБез предоплаты.'
    ),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('✅ CONFIRM', 'confirm')],
          [Markup.button.callback('❌ CANCEL', 'back')]
        ]
      }
    }
  );
});

bot.action('pay_crypto', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText(
    t(chatId,
      '₿ *CRYPTO PAYMENT*\n\nUSDT (ERC20):\n`0x1234567890abcdef1234567890abcdef12345678`\n\nBTC:\n`bc1qxyz...`\n\nSend exact amount and tap confirm.',
      '₿ *КРИПТА*\n\nUSDT (ERC20):\n`0x1234567890abcdef1234567890abcdef12345678`\n\nBTC:\n`bc1qxyz...`\n\nОтправьте точную сумму и подтвердите.'
    ),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('✅ CONFIRM', 'confirm')],
          [Markup.button.callback('❌ CANCEL', 'back')]
        ]
      }
    }
  );
});

// ─────── CONFIRM ORDER ───────
bot.action('confirm', async (ctx) => {
  const chatId = ctx.chat.id;
  const state = user[chatId];
  const c = state?.cart || [];
  const r = state?.delivery || DELIVERY[0];

  let order = `🛒 *NEW PREMIUM ORDER*\n━━━━━━━━━━━━━━━━━━━\n\n`;
  let total = 0;
  c.forEach(i => {
    const p = products.find(x => x.id === i.id);
    if (p) {
      const price = getPrice(p, i.size);
      const sum = price * i.qty;
      total += sum;
      order += `▸ ${p.name_en} ${SIZES.find(s=>s.id===i.size)?.label||''} ×${i.qty} = ${sum.toLocaleString()} THB\n`;
    }
  });
  order += `\n📍 ${r.en} (+${r.price} THB)\n💰 *GRAND TOTAL: ${(total + r.price).toLocaleString()} THB*`;
  order += `\n👤 User: \`${chatId}\`\n🌐 ${state?.lang||'en'}`;

  try { await ctx.telegram.sendMessage(ADMIN_ID, order, { parse_mode: 'Markdown' }); } catch(e) {}

  user[chatId].cart = [];
  delete user[chatId].delivery;

  const confirm = `✅ *ORDER CONFIRMED* ✅\n\n━━━━━━━━━━━━━━━━━━━\n🎉 Thank you for choosing *${CONFIG.botName}*!\n\n📲 We will contact you shortly.\n🌿 Enjoy your premium experience.\n━━━━━━━━━━━━━━━━━━━\n\n🎁 *Loyalty points accrued: ${loyaltyPoints(chatId)} ${CONFIG.currency}*`;

  await ctx.editMessageText(confirm, {
    parse_mode: 'Markdown', ...premiumMenu(chatId)
  });
});

// ─────── FAQ ───────
bot.action('faq', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!adult(chatId)) return;

  await ctx.editMessageText(
    t(chatId,
      `✨ *${CONFIG.botName} — FAQ* ✨\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `🕐 *Hours:* Mon-Sun 10:00-22:00\n` +
      `🚀 *Delivery:* 1-3 hrs (Bangkok), next day (other)\n` +
      `💳 *Payment:* PromptPay • Cash • Crypto\n` +
      `📦 *Packaging:* Discreet, unmarked\n` +
      `🌿 *Quality:* Premium selection, curated weekly\n` +
      `🎁 *Loyalty:* 5% cashback on every order\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `Questions? @dr_Andromeda`,
      `✨ *${CONFIG.botName} — FAQ* ✨\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `🕐 *Часы:* Пн-Вс 10:00-22:00\n` +
      `🚀 *Доставка:* 1-3 часа (Бангкок), на след. день (регионы)\n` +
      `💳 *Оплата:* PromptPay • Наличные • Крипта\n` +
      `📦 *Упаковка:* Дискретная, без маркировки\n` +
      `🌿 *Качество:* Премиум отбор, еженедельно\n` +
      `🎁 *Лояльность:* 5% кэшбэк с каждого заказа\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `Вопросы? @dr_Andromeda`
    ),
    { parse_mode: 'Markdown', ...premiumMenu(chatId) }
  );
});

// ─────── NAVIGATION ───────
bot.action('back', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText(
    t(chatId, '🌿 *Main Menu*', '🌿 *Главное меню*'),
    { parse_mode: 'Markdown', ...premiumMenu(chatId) }
  );
});

bot.action('noop', async (ctx) => ctx.answerCbQuery());

// ─────── TEXT COMMANDS ───────
bot.hears(/^\/help$/i, async (ctx) => {
  const chatId = ctx.chat.id;
  if (!adult(chatId)) return ctx.reply('Please /start and verify age');
  await ctx.reply(
    t(chatId,
      'Browse → Add to cart → Delivery → Pay.\n\nQuestions? @dr_Andromeda',
      'Выбирайте → В корзину → Доставка → Оплата.\n\nВопросы? @dr_Andromeda'
    ),
    premiumMenu(chatId)
  );
});

// ─────── LAUNCH ───────
if (!BOT_TOKEN) {
  console.log('❌ Set BOT_TOKEN env variable');
  process.exit(1);
}

bot.launch();
console.log(`✅ ${CONFIG.botName} v5.5 Premium — running`);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));