// 🌿 Parvati Bot — Premium Botanical Collection
// Age-verified, Telegram-safe, discreet delivery
// v5.0 — @karmadharma_bot

const { Telegraf, Markup } = require('telegraf');
const { products, categories } = require('./products');
const path = require('path');
const fs = require('fs');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ADMIN_ID = Number(process.env.ADMIN_ID || '237228075');

// ─── CONFIG ───
const DELIVERY = [
  { id: 'bangkok',  en: '📍 Bangkok',   ru: '📍 Бангкок',   price: 100 },
  { id: 'phuket',   en: '📍 Phuket',    ru: '📍 Пхукет',    price: 300 },
  { id: 'samui',    en: '📍 Koh Samui', ru: '📍 Самуи',     price: 400 },
  { id: 'phangan',  en: '📍 Koh Phangan',ru: '📍 Панган',    price: 500 },
];

const PAYMENTS = [
  { id: 'qr',     icon: '🇹🇭', en: 'PromptPay QR',       ru: 'PromptPay QR' },
  { id: 'cash',   icon: '💵', en: 'Cash to courier',     ru: 'Наличные курьеру' },
  { id: 'crypto', icon: '₿',  en: 'Crypto USDT/BTC',     ru: 'Крипта USDT/BTC' },
];

// ─── SIZES ───
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

function fmtSize(p, sizeId) {
  return `${SIZES.find(x=>x.id===sizeId).label} — ${getPrice(p,sizeId)} THB`;
}

// ─── STATE ───
const user = {};
function lang(chatId) { return user[chatId]?.lang || 'en'; }
function t(chatId, en, ru) { return lang(chatId) === 'en' ? en : ru; }
function isAdult(chatId) { return user[chatId]?.adult === true; }

function cartTotal(chatId) {
  const c = user[chatId]?.cart || [];
  let sum = 0;
  c.forEach(i => {
    const p = products.find(x => x.id === i.id);
    if (p) sum += getPrice(p, i.size) * i.qty;
  });
  return sum;
}

function cartText(chatId) {
  const c = user[chatId]?.cart || [];
  if (!c.length) return null;
  let text = t(chatId, '🛒 *Cart*\n\n', '🛒 *Корзина*\n\n');
  let sum = 0;
  c.forEach((i,idx) => {
    const p = products.find(x => x.id === i.id);
    if (p) {
      const price = getPrice(p, i.size);
      const itemSum = price * i.qty;
      sum += itemSum;
      text += `${idx+1}. ${p.name_en} ×${i.qty} — ${itemSum} THB\n`;
    }
  });
  text += `\n💰 *Total: ${sum} THB*`;
  return text;
}

function mainMenuKeyboard(chatId) {
  const c = user[chatId]?.cart || [];
  const badge = c.length ? ` (${c.reduce((s,i)=>s+i.qty,0)})` : '';
  return {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback('🛍️ Menu / Menu', 'shop')],
        [Markup.button.callback(`🛒 Cart${badge}`, 'cart'), Markup.button.callback('❓ FAQ', 'faq')],
        [Markup.button.callback('🌍 EN / RU', 'lang_menu')],
      ]
    }
  };
}

// ─── BOT SETUP ───
const bot = new Telegraf(BOT_TOKEN);

// ========== AGE VERIFICATION ==========
bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  
  const welcomePhoto = path.join(__dirname, 'product_default.png');
  const caption = 
    '🌿 *Welcome to Parvati Premium Botanic* 🌿\n\n' +
    'Premium botanical collections — discreet delivery across Thailand 🇹🇭\n\n' +
    '⚠️ *Age Verification Required* / *Требуется подтверждение возраста*';
  
  const buttons = {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback('✅ I am 18+ / Мне есть 18', 'adult_yes')],
        [Markup.button.callback('❌ I am under 18 / Мне нет 18', 'adult_no')],
      ]
    }
  };

  if (fs.existsSync(welcomePhoto)) {
    await ctx.replyWithPhoto({ source: welcomePhoto }, { caption, parse_mode: 'Markdown', ...buttons });
  } else {
    await ctx.reply(caption, { parse_mode: 'Markdown', ...buttons });
  }
});

bot.action('adult_yes', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!user[chatId]) user[chatId] = {};
  user[chatId].adult = true;
  
  const langButtons = {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback('🇬🇧 English', 'lang_en')],
        [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
      ]
    }
  };

  await ctx.editMessageText(
    '✅ *Access granted!*\n\nChoose your language:\n\n🇬🇧 English — Shop premium botanicals\n🇷🇺 Русский — Премиум ботаническая коллекция',
    { parse_mode: 'Markdown', ...langButtons }
  );
});

bot.action('adult_no', async (ctx) => {
  await ctx.editMessageText(
    '⛔ *Access denied.*\n\nThis service is for adults 18+ only.\n\nДоступ запрещён. Только для лиц старше 18 лет.',
    { parse_mode: 'Markdown' }
  );
});

// ========== LANGUAGE ==========
bot.action('lang_en', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!isAdult(chatId)) return ctx.answerCbQuery('Age verification required');
  user[chatId] = { ...user[chatId], lang: 'en', cart: user[chatId]?.cart || [] };

  const welcomePhoto = path.join(__dirname, 'product_premium.png');
  const text = '🌿 *Welcome to Parvati Premium Botanic* 🌿\n\n' +
    'Premium botanical collections for connoisseurs.\n' +
    'Curated selection • Discreet packaging • Fast delivery 🚀\n\n' +
    'Use the menu below to browse 👇';

  if (fs.existsSync(welcomePhoto)) {
    await ctx.deleteMessage().catch(()=>{});
    await ctx.replyWithPhoto({ source: welcomePhoto }, {
      caption: text,
      parse_mode: 'Markdown',
      ...mainMenuKeyboard(chatId)
    });
  } else {
    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...mainMenuKeyboard(chatId)
    });
  }
});

bot.action('lang_ru', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!isAdult(chatId)) return ctx.answerCbQuery('Age verification required');
  user[chatId] = { ...user[chatId], lang: 'ru', cart: user[chatId]?.cart || [] };

  const welcomePhoto = path.join(__dirname, 'product_premium.png');
  const text = '🌿 *Добро пожаловать в Parvati Premium Botanic* 🌿\n\n' +
    'Премиум ботаническая коллекция для ценителей.\n' +
    'Отборный ассортимент • Дискретная упаковка • Быстрая доставка 🚀\n\n' +
    'Используйте меню ниже для навигации 👇';

  if (fs.existsSync(welcomePhoto)) {
    await ctx.deleteMessage().catch(()=>{});
    await ctx.replyWithPhoto({ source: welcomePhoto }, {
      caption: text,
      parse_mode: 'Markdown',
      ...mainMenuKeyboard(chatId)
    });
  } else {
    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...mainMenuKeyboard(chatId)
    });
  }
});

bot.action('lang_menu', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText('🌍 *Language / Язык*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback('🇬🇧 English', 'lang_en'), Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
      ]
    }
  });
});

// ========== SHOP / CATEGORIES ==========
bot.action('shop', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!isAdult(chatId)) return ctx.answerCbQuery('Age verification required');
  
  const btns = categories.map(c => [Markup.button.callback(c.name_en, `cat_${c.id}`)]);
  btns.push([Markup.button.callback(t(chatId,'🔙 Back','🔙 Назад'), 'back')]);
  await ctx.editMessageText(
    t(chatId, '📋 *Categories*:', '📋 *Категории*:'),
    { parse_mode: 'Markdown', reply_markup: { inline_keyboard: btns } }
  );
});

categories.forEach(cat => {
  bot.action(`cat_${cat.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    if (!isAdult(chatId)) return ctx.answerCbQuery('Age verification required');
    
    const pp = products.filter(p => p.cat === cat.id);
    const btns = pp.map(p => [Markup.button.callback(`${p.grade || ''} ${p.name_en}`, `view_${p.id}`)]);
    btns.push([Markup.button.callback(t(chatId,'🔙 Back','🔙 Назад'), 'shop')]);
    await ctx.editMessageText(`${cat.name_en}\n${t(chatId,'Select:','Выберите:')}`, {
      reply_markup: { inline_keyboard: btns }
    });
  });
});

// ========== PRODUCT VIEW ==========
products.forEach(p => {
  bot.action(`view_${p.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    if (!isAdult(chatId)) return ctx.answerCbQuery('Age verification required');
    
    const isEn = lang(chatId) === 'en';
    let text = `✦ *${p.name_en}* ✦\n🏆 ${p.grade} | 🌸 ${p.type || 'Premium'}\n\n`;
    text += isEn ? p.description_en : p.description_ru;
    text += `\n\n✨ ${(p.effects || []).map(e=>`#${e.replace(/\s/g,'')}`).join(' ')}`;
    text += `\n\n💰 *Prices:*\n`;
    SIZES.forEach(s => text += `${fmtSize(p, s.id)}\n`);
    text += `\n📦 Stock: ${p.stock || 'Available'}g`;

    const sb = SIZES.map(s => Markup.button.callback(`${s.label} ${getPrice(p,s.id)} THB`, `add_${p.id}_${s.id}`));
    const rows = [];
    for (let i=0; i<sb.length; i+=2) rows.push(sb.slice(i,i+2));
    rows.push([
      Markup.button.callback(t(chatId,'🔙 Back','🔙 Назад'), `cat_${p.cat}`),
      Markup.button.callback('🛒 Cart', 'cart'),
    ]);

    await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: rows } });
  });
});

// ========== ADD TO CART ==========
products.forEach(p => {
  SIZES.forEach(s => {
    bot.action(`add_${p.id}_${s.id}`, async (ctx) => {
      const chatId = ctx.chat.id;
      if (!isAdult(chatId)) return ctx.answerCbQuery('Age verification required');
      if (!user[chatId]) user[chatId] = { adult: true, lang: 'en', cart: [] };
      if (!user[chatId].cart) user[chatId].cart = [];
      
      const existing = user[chatId].cart.find(i => i.id === p.id && i.size === s.id);
      if (existing) existing.qty += 1;
      else user[chatId].cart.push({ id: p.id, size: s.id, qty: 1 });
      
      await ctx.answerCbQuery(`✅ Added ${SIZES.find(x=>x.id===s.id).label} ${p.name_en}`);
    });
  });
});

// ========== CART ==========
bot.action('cart', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!isAdult(chatId)) return ctx.answerCbQuery('Age verification required');
  
  const text = cartText(chatId);
  if (!text) {
    await ctx.editMessageText(
      t(chatId, '🛒 *Cart is empty*', '🛒 *Корзина пуста*'),
      { parse_mode: 'Markdown', ...mainMenuKeyboard(chatId) }
    );
    return;
  }
  
  const regionButtons = DELIVERY.map(r => [
    Markup.button.callback(`${r.en} (${r.price} THB)`, `deliver_${r.id}`)
  ]);
  regionButtons.push([
    Markup.button.callback(t(chatId, '🛍️ Continue', '🛍️ Продолжить'), 'shop'),
    Markup.button.callback(t(chatId, '🗑️ Clear', '🗑️ Очистить'), 'clear_cart')
  ]);
  
  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: regionButtons }
  });
});

bot.action('clear_cart', async (ctx) => {
  const chatId = ctx.chat.id;
  if (user[chatId]) user[chatId].cart = [];
  await ctx.editMessageText(
    t(chatId, '🗑️ Cart cleared', '🗑️ Корзина очищена'),
    { parse_mode: 'Markdown', ...mainMenuKeyboard(chatId) }
  );
});

// ========== DELIVERY ==========
DELIVERY.forEach(r => {
  bot.action(`deliver_${r.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    if (!isAdult(chatId)) return;
    user[chatId].delivery = r;
    
    const total = cartTotal(chatId);
    const grandTotal = total + r.price;
    
    const text = t(chatId,
      `✅ *Order Summary*\n📦 Subtotal: ${total} THB\n📍 ${r.en}: +${r.price} THB\n💰 *Total: ${grandTotal} THB*\n\n*Choose payment:*`,
      `✅ *Итог заказа*\n📦 Сумма: ${total} THB\n📍 ${r.ru}: +${r.price} THB\n💰 *Итого: ${grandTotal} THB*\n\n*Выберите оплату:*`
    );
    
    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('🇹🇭 PromptPay QR', 'pay_qr')],
          [Markup.button.callback('💵 Cash', 'pay_cash')],
          [Markup.button.callback('₿ Crypto', 'pay_crypto')],
          [Markup.button.callback(t(chatId,'❌ Cancel','❌ Отмена'), 'cart')]
        ]
      }
    });
  });
});

// ========== PAYMENT ==========
bot.action('pay_qr', async (ctx) => {
  const chatId = ctx.chat.id;
  const total = cartTotal(chatId) + (user[chatId]?.delivery?.price || 100);
  const phone = '0812345678';
  const qrUrl = `https://promptpay.io/${phone}/${total}.png`;
  
  await ctx.editMessageText(
    t(chatId,
      `💳 *PromptPay*\nAmount: ${total} THB\nScan QR below:`,
      `💳 *PromptPay*\nСумма: ${total} THB\nQR код ниже:`
    ),
    { parse_mode: 'Markdown' }
  );
  
  try {
    await ctx.replyWithPhoto({ url: qrUrl }, {
      caption: t(chatId,
        `Pay ${total} THB via PromptPay\nThen tap ✅`,
        `Оплатите ${total} THB через PromptPay\nЗатем нажмите ✅`
      ),
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('✅ I Paid / Оплатил', 'confirm')],
          [Markup.button.callback('❌ Cancel', 'back')]
        ]
      }
    });
  } catch(e) {
    await ctx.reply(`QR: ${qrUrl}\n\n` + t(chatId,'Confirm when paid','Подтвердите оплату'), {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('✅ I Paid', 'confirm')],
          [Markup.button.callback('❌ Cancel', 'back')]
        ]
      }
    });
  }
});

bot.action('pay_cash', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText(
    t(chatId,
      '💵 *Cash to courier*\nPay when order arrives.',
      '💵 *Наличные курьеру*\nОплата при получении.'
    ),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('✅ Confirm', 'confirm')],
          [Markup.button.callback('❌ Cancel', 'back')]
        ]
      }
    }
  );
});

bot.action('pay_crypto', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText(
    t(chatId,
      '₿ *Crypto*\n\nUSDT (ERC20):\n`0x1234567890abcdef1234567890abcdef12345678`\n\nBTC:\n`bc1qxyz...`',
      '₿ *Крипта*\n\nUSDT (ERC20):\n`0x1234567890abcdef1234567890abcdef12345678`\n\nBTC:\n`bc1qxyz...`'
    ),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('✅ Sent', 'confirm')],
          [Markup.button.callback('❌ Cancel', 'back')]
        ]
      }
    }
  );
});

// ========== CONFIRM ORDER ==========
bot.action('confirm', async (ctx) => {
  const chatId = ctx.chat.id;
  const state = user[chatId];
  const c = state?.cart || [];
  const r = state?.delivery || DELIVERY[0];
  
  let order = `🛒 *New Order — Parvati*\n\n`;
  let total = 0;
  c.forEach(i => {
    const p = products.find(x => x.id === i.id);
    if (p) {
      const price = getPrice(p, i.size);
      const itemSum = price * i.qty;
      total += itemSum;
      order += `• ${p.name_en} ${SIZES.find(s=>s.id===i.size)?.label||''} ×${i.qty} = ${itemSum} THB\n`;
    }
  });
  order += `\n📍 ${r.en} (+${r.price} THB)\n💰 *Total: ${total + r.price} THB*\n👤 User: \`${chatId}\`\n🌐 ${state?.lang||'en'}`;
  
  try { await ctx.telegram.sendMessage(ADMIN_ID, order, { parse_mode: 'Markdown' }); } catch(e) {}
  
  user[chatId].cart = [];
  delete user[chatId].delivery;
  
  const confirmText = t(chatId,
    '✅ *Order confirmed!* 🎉\nWe\'ll contact you shortly 📲\n\nThank you for choosing Parvati Premium Botanic!',
    '✅ *Заказ подтверждён!* 🎉\nМы свяжемся с вами 📲\n\nСпасибо за выбор Parvati Premium Botanic!'
  );
  
  await ctx.editMessageText(confirmText, {
    parse_mode: 'Markdown',
    ...mainMenuKeyboard(chatId)
  });
});

// ========== FAQ ==========
bot.action('faq', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!isAdult(chatId)) return;
  await ctx.editMessageText(
    t(chatId,
      '❓ *FAQ*\n\n' +
      '🕐 *Hours:* Mon-Sun 10:00-22:00\n' +
      '🚚 *Delivery:* 1-3 hours (Bangkok), next day (other regions)\n' +
      '💳 *Payment:* PromptPay / Cash / Crypto\n' +
      '📦 *Packaging:* Discreet, unmarked\n' +
      '🌿 *Quality:* Premium selection, curated weekly\n\n' +
      'Questions? @dr_Andromeda',
      '❓ *FAQ*\n\n' +
      '🕐 *Часы:* Пн-Вс 10:00-22:00\n' +
      '🚚 *Доставка:* 1-3 часа (Бангкок), на след. день (регионы)\n' +
      '💳 *Оплата:* PromptPay / Наличные / Крипта\n' +
      '📦 *Упаковка:* Дискретная, без маркировки\n' +
      '🌿 *Качество:* Премиум отбор, еженедельное обновление\n\n' +
      'Вопросы? @dr_Andromeda'
    ),
    { parse_mode: 'Markdown', ...mainMenuKeyboard(chatId) }
  );
});

// ========== NAVIGATION ==========
bot.action('back', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText(
    t(chatId, '🌿 *Main Menu*', '🌿 *Главное меню*'),
    { parse_mode: 'Markdown', ...mainMenuKeyboard(chatId) }
  );
});

bot.action('noop', async (ctx) => ctx.answerCbQuery());

// ========== HELP TEXT ==========
bot.hears(/^(❓ Help|❓ Помощь|/help)$/, async (ctx) => {
  const chatId = ctx.chat.id;
  if (!isAdult(chatId)) return ctx.reply('Please verify age via /start');
  await ctx.reply(
    t(chatId,
      'Welcome! Browse Menu → add to cart → choose delivery → pay.\n\nQuestions? @dr_Andromeda',
      'Листайте Меню → добавляйте в корзину → выберите доставку → оплата.\n\nВопросы? @dr_Andromeda'
    ),
    { ...mainMenuKeyboard(chatId) }
  );
});

// ========== LAUNCH ==========
if (!BOT_TOKEN) {
  console.log('❌ Set BOT_TOKEN env variable');
  process.exit(1);
}

bot.launch();
console.log('✅ Parvati Premium Botanic v5.0 — running');

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));