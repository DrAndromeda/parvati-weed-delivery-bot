#!/usr/bin/env node
// 🌿 Parvati Weed Bot v3.0 — Premium Edition
// Full-screen menu · Product cards · Cart · 3 payments · FAQ · Delivery
const { Telegraf, Markup } = require('telegraf');
const { products, categories } = require('./products_spar_city');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ADMIN_ID = Number(process.env.ADMIN_ID || '237228075');
const WELCOME_IMG = ''; // Set your welcome image URL here
const PRODUCT_IMG = ''; // Set default product image URL here

// ─── DATA ───
const DELIVERY = [
  { id: 'bangkok',   en: '📍 Bangkok',        ru: '📍 Бангкок',     price: 100 },
  { id: 'phuket',    en: '📍 Phuket',          ru: '📍 Пхукет',      price: 300 },
  { id: 'samui',     en: '📍 Koh Samui',       ru: '📍 Самуи',       price: 400 },
  { id: 'phangan',   en: '📍 Koh Phangan',     ru: '📍 Панган',      price: 500 },
  { id: 'patong',    en: '📍 Patong Beach',    ru: '📍 Патонг Бич',  price: 200 },
  { id: 'krabi',     en: '📍 Krabi',           ru: '📍 Краби',       price: 350 },
];

const PAYMENTS = [
  { id: 'qr',     icon: '🇹🇭', en: 'PromptPay QR',       ru: 'PromptPay QR' },
  { id: 'cash',   icon: '💵', en: 'Cash to courier',     ru: 'Наличные курьеру' },
  { id: 'crypto', icon: '₿',  en: 'Crypto (USDT/BTC)',  ru: 'Крипта (USDT/BTC)' },
];

const FAQ_DATA = [
  { icon: '🚀', en: 'Delivery time', ru: 'Время доставки', en_v: '30-60 min within Bangkok.\nOther areas 60-120 min.', ru_v: '30-60 мин по Бангкоку.\nДругие районы 60-120 мин.' },
  { icon: '💳', en: 'Payment', ru: 'Оплата', en_v: 'PromptPay QR, cash to courier, or crypto (USDT/BTC).', ru_v: 'PromptPay QR, наличные курьеру, крипта (USDT/BTC).' },
  { icon: '🕐', en: 'Working hours', ru: 'Часы работы', en_v: 'Daily 10:00 — 23:00', ru_v: 'Ежедневно 10:00 — 23:00' },
  { icon: '📦', en: 'Minimum order', ru: 'Мин. заказ', en_v: '300 THB', ru_v: '300 THB' },
  { icon: '🔒', en: 'Discreet packaging', ru: 'Дискретная упаковка', en_v: 'All orders in unmarked packaging.', ru_v: 'Все заказы в безликой упаковке.' },
  { icon: '📞', en: 'Support', ru: 'Поддержка', en_v: 'Contact us via Telegram after ordering.', ru_v: 'Свяжитесь с нами в Telegram после заказа.' },
];

const SIZES = [
  { id: 'gram',   label: '🌱 1g' },
  { id: 'eighth', label: '🔥 3.5g' },
  { id: 'quarter', label: '🌈 7g' },
  { id: 'half',   label: '💎 14g' },
  { id: 'ounce',  label: '👑 28g' },
];

const SIZE_KEY = { gram: 'price_gram', eighth: 'price_8th', quarter: 'price_quarter', half: 'price_half', ounce: 'price_ounce' };
const SIZE_WT = { gram: '1g', eighth: '3.5g', quarter: '7g', half: '14g', ounce: '28g' };

// ─── STATE ───
const user = {}; // chatId -> { lang, cart: [{id, size, qty}], deliveryRegion, paymentMethod }

function l(chatId, en, ru) { return (user[chatId]?.lang || 'en') === 'en' ? en : ru; }

function cartTotal(chatId) {
  const c = user[chatId]?.cart || [];
  let t = 0;
  c.forEach(i => {
    const p = products.find(x => x.id === i.id);
    if (p) t += (p[SIZE_KEY[i.size]] || 0) * i.qty;
  });
  return t;
}

function fmtCart(chatId) {
  const c = user[chatId]?.cart || [];
  if (!c.length) return null;
  let t = '';
  let total = 0;
  c.forEach((i, idx) => {
    const p = products.find(x => x.id === i.id);
    if (p) {
      const u = p[SIZE_KEY[i.size]] || 0;
      const st = u * i.qty;
      total += st;
      t += `${idx+1}. ${i.qty}× ${SIZE_WT[i.size]} — ${p.name_en}\n   💰 ${st.toLocaleString()} THB\n`;
    }
  });
  t += `\n💵 **Total: ${total.toLocaleString()} THB**`;
  return t;
}

function mainMenu(chatId) {
  const c = user[chatId]?.cart || [];
  const badge = c.length ? ` 🛒${c.reduce((s,i) => s+i.qty, 0)}` : '';
  return {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback('🛍️ Shop', 'shop')],
        [Markup.button.callback(`🛒 Cart${badge}`, 'cart'), Markup.button.callback('ℹ️ FAQ', 'faq')],
        [Markup.button.callback('🌍 Language', 'lang_menu')],
      ]
    }
  };
}

// ─── BOT ───
const bot = new Telegraf(BOT_TOKEN);

// ── WELCOME ──
bot.start(async (ctx) => {
  const e = '🌿 **Welcome to Parvati Weed Thailand!**\n\nPremium cannabis delivery across Thailand 🇹🇭\nTop-grade strains from 4A to 5A+ ✨\nFast 30-min delivery in Bangkok 🚀\n\n🇬🇧 English · 🇷🇺 Русский';
  const r = '🌿 **Добро пожаловать в Parvati Weed Thailand!**\n\nПремиум доставка каннабиса по Таиланду 🇹🇭\nТоп-сорта от 4A до 5A+ ✨\nБыстрая доставка 30 мин по Бангкоку 🚀\n\n🇬🇧 English · 🇷🇺 Русский';
  const buttons = [
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
  ];
  if (WELCOME_IMG) {
    await ctx.replyWithPhoto(WELCOME_IMG, { caption: e, parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
  } else {
    await ctx.reply(e, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
  }
});

// ── LANGUAGE ──
bot.action('lang_en', async (ctx) => {
  user[ctx.chat.id] = { lang: 'en', cart: [] };
  await ctx.editMessageText('🌿 Welcome to **Parvati Weed Thailand**\nPremium cannabis delivered to your door 🚀', { parse_mode: 'Markdown', ...mainMenu(ctx.chat.id) });
});
bot.action('lang_ru', async (ctx) => {
  user[ctx.chat.id] = { lang: 'ru', cart: [] };
  await ctx.editMessageText('🌿 Добро пожаловать в **Parvati Weed Thailand**\nПремиум каннабис с доставкой до двери 🚀', { parse_mode: 'Markdown', ...mainMenu(ctx.chat.id) });
});
bot.action('lang_menu', async (ctx) => {
  const buttons = [
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
  ];
  await ctx.editMessageText('🌍 Choose language:', { reply_markup: { inline_keyboard: buttons } });
});

// ── SHOP ──
bot.action('shop', async (ctx) => {
  const chatId = ctx.chat.id;
  const buttons = categories.map(c => [Markup.button.callback(`${c.name_en}`, `cat_${c.id}`)]);
  buttons.push([Markup.button.callback(l(chatId, '🔙 Main Menu', '🔙 Главное меню'), 'back_main')]);
  await ctx.editMessageText(l(chatId, '📋 **Choose category:**', '📋 **Выберите категорию:**'), { parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
});

categories.forEach(cat => {
  bot.action(`cat_${cat.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    const pp = products.filter(p => p.cat === cat.id);
    const buttons = pp.map(p => [
      Markup.button.callback(`${p.grade} ${p.name_en} — 💰${p.price_gram}฿`, `view_${p.id}`)
    ]);
    buttons.push([Markup.button.callback(l(chatId, '🔙 Categories', '🔙 Категории'), 'shop')]);
    await ctx.editMessageText(`${cat.name_en}\n\n${l(chatId, 'Tap a strain:', 'Выберите сорт:')}`, { reply_markup: { inline_keyboard: buttons } });
  });
});

// ── PRODUCT CARD ──
products.forEach(p => {
  bot.action(`view_${p.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    const isEn = l(chatId, true, false) === true || (user[chatId]?.lang || 'en') === 'en';

    let text = `✦ **${p.name_en}** ✦\n🏆 Grade: ${p.grade}  |  🌸 ${p.type}\n\n`;
    text += `📝 ${isEn ? p.description_en : p.description_ru}\n\n`;
    text += `✨ **Effects:** ${p.effects.map(e => `#${e.replace(/\s/g,'')}`).join(' · ')}\n\n`;
    text += `💰 **Prices:**\n`;
    SIZES.forEach(s => {
      const val = p[SIZE_KEY[s.id]];
      text += `${s.label} — **${val.toLocaleString()} THB**\n`;
    });
    text += `\n📦 Stock: ${p.stock}g`;

    // Size buttons
    const sb = SIZES.map(s => Markup.button.callback(`${s.label} ${p[SIZE_KEY[s.id]]}฿`, `add_${p.id}_${s.id}`));
    const rows = [];
    for (let i = 0; i < sb.length; i += 2) rows.push(sb.slice(i, i+2));
    rows.push([
      Markup.button.callback(l(chatId, '🔙 Back', '🔙 Назад'), `cat_${p.cat}`),
      Markup.button.callback(l(chatId, '🛒 Cart', '🛒 Корзина'), 'cart'),
    ]);

    if (p.image) {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: rows } });
    } else {
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: rows } });
    }
  });
});

// ── ADD TO CART ──
products.forEach(p => {
  SIZES.forEach(s => {
    bot.action(`add_${p.id}_${s.id}`, async (ctx) => {
      const chatId = ctx.chat.id;
      if (!user[chatId]) user[chatId] = { lang: 'en', cart: [] };
      const cart = user[chatId].cart;
      const ex = cart.find(i => i.id === p.id && i.size === s.id);
      if (ex) ex.qty++;
      else cart.push({ id: p.id, size: s.id, qty: 1 });

      await ctx.answerCbQuery(`✅ ${p.name_en} ${SIZE_WT[s.id]} added!`);
      // Re-render product card
      const isEn = (user[chatId]?.lang || 'en') === 'en';
      let text = `✦ **${p.name_en}** ✦\n🏆 Grade: ${p.grade}  |  🌸 ${p.type}\n\n`;
      text += `📝 ${isEn ? p.description_en : p.description_ru}\n\n`;
      text += `✨ **Effects:** ${p.effects.map(e => `#${e.replace(/\s/g,'')}`).join(' · ')}\n\n💰 **Prices:**\n`;
      SIZES.forEach(sz => text += `${sz.label} — **${p[SIZE_KEY[sz.id]].toLocaleString()} THB**\n`);
      text += `\n📦 Stock: ${p.stock}g`;

      const sb = SIZES.map(sz => Markup.button.callback(`${sz.label} ${p[SIZE_KEY[sz.id]]}฿`, `add_${p.id}_${sz.id}`));
      const rows = [];
      for (let i = 0; i < sb.length; i += 2) rows.push(sb.slice(i, i+2));
      rows.push([
        Markup.button.callback(l(chatId, '🔙 Back', '🔙 Назад'), `cat_${p.cat}`),
        Markup.button.callback(l(chatId, '🛒 Cart', '🛒 Корзина'), 'cart'),
      ]);
      await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: rows } });
    });
  });
});

// ── CART ──
bot.action('cart', async (ctx) => {
  const chatId = ctx.chat.id;
  let text = fmtCart(chatId);
  if (!text) {
    await ctx.editMessageText(l(chatId, '🛒 Your cart is empty', '🛒 Корзина пуста'), { parse_mode: 'Markdown', ...mainMenu(chatId) });
    return;
  }

  const cart = user[chatId]?.cart || [];
  const rows = [];
  cart.forEach((item, idx) => {
    rows.push([
      Markup.button.callback('➖', `dec_${idx}`),
      Markup.button.callback(`${item.qty}`, `qty_${idx}`),
      Markup.button.callback('➕', `inc_${idx}`),
      Markup.button.callback('🗑️', `del_${idx}`),
    ]);
  });
  rows.push([
    Markup.button.callback(l(chatId, '🛍️ Shop', '🛍️ Магазин'), 'shop'),
    Markup.button.callback(l(chatId, '🗑️ Clear', '🗑️ Очистить'), 'clear_cart'),
  ]);
  rows.push([Markup.button.callback(l(chatId, '✅ Checkout', '✅ Оформить'), 'checkout')]);

  await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: rows } });
});

// ── CART CONTROLS ──
function rebuildCartKeyboard(chatId) {
  const cart = user[chatId]?.cart || [];
  const rows = [];
  cart.forEach((item, idx) => {
    rows.push([
      Markup.button.callback('➖', `dec_${idx}`),
      Markup.button.callback(`${item.qty}`, `qty_${idx}`),
      Markup.button.callback('➕', `inc_${idx}`),
      Markup.button.callback('🗑️', `del_${idx}`),
    ]);
  });
  rows.push([Markup.button.callback(l(chatId, '🛍️ Shop', '🛍️ Магазин'), 'shop'),
    Markup.button.callback(l(chatId, '🗑️ Clear', '🗑️ Очистить'), 'clear_cart')]);
  rows.push([Markup.button.callback(l(chatId, '✅ Checkout', '✅ Оформить'), 'checkout')]);
  return rows;
}

bot.action(/^inc_(\d+)$/, async (ctx) => {
  const chatId = ctx.chat.id;
  const idx = parseInt(ctx.match[1]);
  if (user[chatId]?.cart?.[idx]) user[chatId].cart[idx].qty++;
  await ctx.answerCbQuery('+1');
  const text = fmtCart(chatId);
  if (!text) { await ctx.editMessageText(l(chatId,'Cart empty','Корзина пуста'), mainMenu(chatId)); return; }
  await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: rebuildCartKeyboard(chatId) } });
});

bot.action(/^dec_(\d+)$/, async (ctx) => {
  const chatId = ctx.chat.id;
  const idx = parseInt(ctx.match[1]);
  if (user[chatId]?.cart?.[idx]) {
    user[chatId].cart[idx].qty--;
    if (user[chatId].cart[idx].qty <= 0) user[chatId].cart.splice(idx, 1);
  }
  await ctx.answerCbQuery('-1');
  const text = fmtCart(chatId);
  if (!text) { await ctx.editMessageText(l(chatId,'Cart empty','Корзина пуста'), mainMenu(chatId)); return; }
  await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: rebuildCartKeyboard(chatId) } });
});

bot.action('clear_cart', async (ctx) => {
  const chatId = ctx.chat.id;
  if (user[chatId]) user[chatId].cart = [];
  await ctx.editMessageText(l(chatId, '🗑️ Cart cleared!', '🗑️ Корзина очищена!'), { parse_mode: 'Markdown', ...mainMenu(chatId) });
});

// ── CHECKOUT ──
bot.action('checkout', async (ctx) => {
  const chatId = ctx.chat.id;
  const text = fmtCart(chatId);
  if (!text) { await ctx.editMessageText(l(chatId,'Cart empty','Корзина пуста'), mainMenu(chatId)); return; }
  const buttons = DELIVERY.map(d => [Markup.button.callback(`${d.en} (+${d.price}฿)`, `del_${d.id}`)]);
  await ctx.editMessageText(`${text}\n\n📍 ${l(chatId, 'Select delivery:', 'Выберите доставку:')}`, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
});

DELIVERY.forEach(d => {
  bot.action(`del_${d.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    user[chatId].delivery = d;
    const subtotal = cartTotal(chatId);
    const total = subtotal + d.price;
    const text = `${fmtCart(chatId)}\n\n📍 ${d.en} (+${d.price} THB)\n💰 **Total: ${total.toLocaleString()} THB**\n\n${l(chatId, '💳 Choose payment:', '💳 Выберите оплату:')}`;
    const buttons = PAYMENTS.map(m => [Markup.button.callback(`${m.icon} ${m.en}`, `pay_${m.id}`)]);
    await ctx.editMessageText(text, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } });
  });
});

PAYMENTS.forEach(m => {
  bot.action(`pay_${m.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    user[chatId].payment = m;
    const subtotal = cartTotal(chatId);
    const d = user[chatId].delivery || DELIVERY[0];
    const total = subtotal + d.price;

    let payInfo = '';
    if (m.id === 'qr') payInfo = l(chatId, '📱 Pay via PromptPay QR on delivery', '📱 Оплата PromptPay QR при доставке');
    else if (m.id === 'cash') payInfo = l(chatId, '💵 Pay cash to courier', '💵 Наличные курьеру');
    else payInfo = l(chatId, '₿ USDT/BTC — address sent after confirmation', '₿ USDT/BTC — адрес после подтверждения');

    const text = `${fmtCart(chatId)}\n\n📍 ${d.en} (+${d.price} THB)\n💳 **${m.icon} ${m.en}**\n📝 ${payInfo}\n\n💰 **Total: ${total.toLocaleString()} THB**\n\n${l(chatId, '✅ Confirm order?', '✅ Подтвердить заказ?')}`;
    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [
        [Markup.button.callback(l(chatId, '✅ Confirm', '✅ Подтвердить'), 'confirm')],
        [Markup.button.callback(l(chatId, '❌ Cancel', '❌ Отмена'), 'cart')],
      ]}
    });
  });
});

bot.action('confirm', async (ctx) => {
  const chatId = ctx.chat.id;
  const s = user[chatId];
  const cart = s?.cart || [];
  const d = s?.delivery || DELIVERY[0];
  const m = s?.payment || PAYMENTS[0];
  const lang = s?.lang || 'en';

  let total = 0;
  let order = `🛒 **New Order — Parvati Weed**\n━━━━━━━━━━━━━\n`;
  cart.forEach(i => {
    const p = products.find(x => x.id === i.id);
    if (p) {
      const u = p[SIZE_KEY[i.size]] || 0;
      const st = u * i.qty;
      total += st;
      order += `• ${p.name_en} (${SIZE_WT[i.size]}) × ${i.qty} = ${st.toLocaleString()} THB\n`;
    }
  });
  order += `━━━━━━━━━━━━━\n📍 ${d.en} (+${d.price} THB)\n💳 ${m.icon} ${m.en}\n💰 **Total: ${(total + d.price).toLocaleString()} THB**\n\n👤 User: [${chatId}](tg://user?id=${chatId})`;

  await ctx.telegram.sendMessage(ADMIN_ID, order, { parse_mode: 'Markdown' });
  user[chatId].cart = [];
  delete user[chatId].delivery;
  delete user[chatId].payment;

  await ctx.editMessageText(
    l(chatId, `✅ **Order confirmed!** Total: ${(total + d.price).toLocaleString()} THB\n\nWe\'ll contact you on Telegram shortly 📲`, `✅ **Заказ подтверждён!** Сумма: ${(total + d.price).toLocaleString()} THB\n\nМы свяжемся с вами в Telegram 📲`),
    { parse_mode: 'Markdown', ...mainMenu(chatId) }
  );
});

// ── FAQ ──
bot.action('faq', async (ctx) => {
  const chatId = ctx.chat.id;
  const isEn = (user[chatId]?.lang || 'en') === 'en';
  let text = isEn ? '**❓ FAQ**\n\n' : '**❓ Часто задаваемые вопросы**\n\n';
  FAQ_DATA.forEach(f => {
    text += `${f.icon} **${isEn ? f.en : f.ru}:**\n${isEn ? f.en_v : f.ru_v}\n\n`;
  });
  text += isEn ? 'Tap 📞 to contact us after ordering!' : 'Нажмите 📞 чтобы связаться после заказа!';
  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: [
      [Markup.button.callback(l(chatId, '🔙 Main Menu', '🔙 Главное меню'), 'back_main')],
    ]}
  });
});

// ── BACK ──
bot.action('back_main', async (ctx) => {
  const chatId = ctx.chat.id;
  const c = user[chatId]?.cart || [];
  const badge = c.length ? ` 🛒${c.reduce((s,i) => s+i.qty, 0)}` : '';
  await ctx.editMessageText(l(chatId, '🌿 **Main Menu**', '🌿 **Главное меню**'), {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback('🛍️ Shop', 'shop')],
        [Markup.button.callback(`🛒 Cart${badge}`, 'cart'), Markup.button.callback('ℹ️ FAQ', 'faq')],
        [Markup.button.callback('🌍 Language', 'lang_menu')],
      ]
    }
  });
});

// ── LAUNCH ──
if (!BOT_TOKEN) { console.error('❌ Missing BOT_TOKEN'); process.exit(1); }
bot.launch();
console.log('🚀 Parvati Weed v3.0 — Running');
console.log(`👤 Admin: ${ADMIN_ID} | Products: ${products.length} | Cats: ${categories.length}`);
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));