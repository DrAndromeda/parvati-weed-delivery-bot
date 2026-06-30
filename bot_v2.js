// 🌿 Parvati Weed Bot v2.0 - Premium Edition
// With Spar City products, cart with weight selection, 3 payment methods
const { Telegraf, Markup } = require('telegraf');
const { categories, products } = require('./products_spar_city');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ADMIN_ID = Number(process.env.ADMIN_ID || '237228075');

// === DELIVERY ===
const deliveryRegions = [
  { id: 'bangkok',   name_en: 'Bangkok',         name_ru: 'Бангкок',     price: 100 },
  { id: 'phuket',    name_en: 'Phuket',           name_ru: 'Пхукет',      price: 300 },
  { id: 'samui',     name_en: 'Koh Samui',        name_ru: 'Самуи',       price: 400 },
  { id: 'pangyan',   name_en: 'Koh Phangan',      name_ru: 'Панган',      price: 500 },
  { id: 'patong',    name_en: 'Patong Beach',     name_ru: 'Патонг Бич',  price: 200 },
  { id: 'krabi',     name_en: 'Krabi',            name_ru: 'Краби',       price: 350 },
];

// === PAYMENT METHODS ===
const paymentMethods = [
  { id: 'qrcode',  icon: '🇹🇭', name_en: 'PromptPay QR',     name_ru: 'PromptPay QR' },
  { id: 'cash',    icon: '💵', name_en: 'Cash to courier',    name_ru: 'Наличные курьеру' },
  { id: 'crypto',  icon: '₿',  name_en: 'Crypto (USDT/BTC)', name_ru: 'Крипта (USDT/BTC)' },
];

// === SIZES ===
const sizes = [
  { id: 'gram',     label: '1g' },
  { id: 'eighth',   label: '3.5g' },
  { id: 'quarter',  label: '7g' },
  { id: 'half',     label: '14g' },
  { id: 'ounce',    label: '28g' },
];

// === STATE ===
const userState = {};

function t(chatId, en, ru) {
  const lang = userState[chatId]?.lang || 'en';
  return lang === 'ru' ? ru : en;
}

function getPriceKey(sizeId) {
  return { gram: 'price_gram', eighth: 'price_8th', quarter: 'price_quarter', half: 'price_half', ounce: 'price_ounce' }[sizeId] || 'price_gram';
}

function getSizeWeight(sizeId) {
  return { gram: '1g', eighth: '3.5g', quarter: '7g', half: '14g', ounce: '28g' }[sizeId] || '1g';
}

// === CART HELPERS ===
function getCartTotal(chatId) {
  const cart = userState[chatId]?.cart || [];
  let total = 0;
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      const priceKey = getPriceKey(item.size);
      total += (p[priceKey] || 0) * item.qty;
    }
  });
  return total;
}

function formatCartText(chatId) {
  const cart = userState[chatId]?.cart || [];
  if (cart.length === 0) return null;

  let text = t(chatId, '🛒 *Your Cart*\n\n', '🛒 *Ваша корзина*\n\n');
  let total = 0;
  cart.forEach((item, idx) => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      const priceKey = getPriceKey(item.size);
      const unitPrice = p[priceKey] || 0;
      const itemTotal = unitPrice * item.qty;
      total += itemTotal;
      text += `${idx + 1}. *${p.name_en}*\n`;
      text += `   ${getSizeWeight(item.size)} × ${item.qty} = ${itemTotal.toLocaleString()} THB\n`;
    }
  });
  text += `\n*💰 Total: ${total.toLocaleString()} THB*`;
  return text;
}

// === MAIN MENU ===
function mainMenu(chatId) {
  const cart = userState[chatId]?.cart || [];
  const cartBadge = cart.length > 0 ? ` 🛒(${cart.reduce((s,i) => s + i.qty, 0)})` : '';
  return {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(t(chatId, '🛍️ Shop / Menu', '🛍️ Магазин / Меню'), 'shop')],
        [Markup.button.callback(`${t(chatId, '🛒 Cart', '🛒 Корзина')}${cartBadge}`, 'cart')],
        [Markup.button.callback(t(chatId, '🌍 Language', '🌍 Язык'), 'change_lang')],
      ]
    }
  };
}

// === PRODUCT CARD ===
function formatProductCard(p, lang) {
  const isEn = lang === 'en';
  let text = isEn
    ? `✦ *${p.name_en}* ✦\n🏆 Grade: ${p.grade}  |  🌸 ${p.type}\n\n`
    : `✦ *${p.name_ru}* ✦\n🏆 Грейд: ${p.grade}  |  🌸 ${p.type}\n\n`;

  text += `📋 ${p.cat_label}\n\n`;

  // Effects
  text += isEn ? '✨ *Effects:* ' : '✨ *Эффекты:* ';
  text += p.effects.map(e => `#${e.replace(/\s/g, '')}`).join(' · ') + '\n\n';

  // Prices
  text += isEn ? '💰 *Prices:*\n' : '💰 *Цены:*\n';
  text += `🟢 1g — *${p.price_gram} THB*\n`;
  text += `🟡 3.5g — *${p.price_8th} THB*\n`;
  text += `🟠 7g — *${p.price_quarter} THB*\n`;
  text += `🔴 14g — *${p.price_half} THB*\n`;
  text += `⚫ 28g — *${p.price_ounce} THB*\n\n`;

  text += isEn
    ? `📦 Stock: ${p.stock}g available`
    : `📦 Остаток: ${p.stock}г в наличии`;

  return text;
}

// === BOT ===
const bot = new Telegraf(BOT_TOKEN);

// START
bot.start(async (ctx) => {
  const buttons = [
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
  ];
  await ctx.reply(
    '🌿 *Welcome to Parvati Weed Thailand*\nPremium cannabis delivery 🚀\n\nChoose your language / Выберите язык:',
    { parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } }
  );
});

// LANGUAGE
bot.action('lang_en', async (ctx) => {
  const chatId = ctx.chat.id;
  userState[chatId] = { lang: 'en', cart: [] };
  await ctx.editMessageText('🌿 Welcome! Premium cannabis delivered to your door 🚀', {
    parse_mode: 'Markdown', ...mainMenu(chatId)
  });
});

bot.action('lang_ru', async (ctx) => {
  const chatId = ctx.chat.id;
  userState[chatId] = { lang: 'ru', cart: [] };
  await ctx.editMessageText('🌿 Добро пожаловать! Премиум каннабис с доставкой 🚀', {
    parse_mode: 'Markdown', ...mainMenu(chatId)
  });
});

bot.action('change_lang', async (ctx) => {
  const buttons = [
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
  ];
  await ctx.editMessageText('Choose language / Выберите язык:', {
    reply_markup: { inline_keyboard: buttons }
  });
});

// SHOP - Categories
bot.action('shop', async (ctx) => {
  const chatId = ctx.chat.id;
  const buttons = categories.map(cat => [
    Markup.button.callback(`${cat.name_en}`, `cat_${cat.id}`)
  ]);
  buttons.push([Markup.button.callback(t(chatId, '🔙 Back', '🔙 Назад'), 'back_main')]);
  await ctx.editMessageText(
    t(chatId, '📋 *Choose category:*', '📋 *Выберите категорию:*'),
    { parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } }
  );
});

// Category products
categories.forEach(cat => {
  bot.action(`cat_${cat.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    const lang = userState[chatId]?.lang || 'en';
    const catProducts = products.filter(p => p.cat === cat.id);
    const buttons = catProducts.map(p => [
      Markup.button.callback(
        `${p.grade} ${lang === 'en' ? p.name_en : p.name_ru} — 💰${(lang === 'en' ? p.price_gram : p.price_gram)}฿`,
        `view_${p.id}`
      )
    ]);
    buttons.push([Markup.button.callback(t(chatId, '🔙 Back', '🔙 Назад'), 'shop')]);

    await ctx.editMessageText(
      `${cat.name_en}\n\n` + t(chatId, 'Choose product:', 'Выберите товар:'),
      { reply_markup: { inline_keyboard: buttons } }
    );
  });
});

// View product detail
products.forEach(p => {
  bot.action(`view_${p.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    const lang = userState[chatId]?.lang || 'en';
    const text = formatProductCard(p, lang);

    // Build size selection buttons
    const sizeButtons = sizes.map(s => {
      const priceKey = getPriceKey(s.id);
      return Markup.button.callback(
        `${s.label} — ${p[priceKey]} ฿`,
        `add_${p.id}_${s.id}`
      );
    });

    const buttons = [];
    // 2 per row
    for (let i = 0; i < sizeButtons.length; i += 2) {
      buttons.push(sizeButtons.slice(i, i + 2));
    }
    buttons.push([
      Markup.button.callback(t(chatId, '🔙 Back', '🔙 Назад'), `cat_${p.cat}`),
      Markup.button.callback(t(chatId, '🛒 Cart', '🛒 Корзина'), 'cart'),
    ]);

    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  });
});

// Add to cart
products.forEach(p => {
  sizes.forEach(s => {
    bot.action(`add_${p.id}_${s.id}`, async (ctx) => {
      const chatId = ctx.chat.id;
      if (!userState[chatId]) userState[chatId] = { lang: 'en', cart: [] };

      const cart = userState[chatId].cart;
      const existing = cart.find(i => i.id === p.id && i.size === s.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id: p.id, size: s.id, qty: 1 });
      }

      const priceKey = getPriceKey(s.id);
      const lang = userState[chatId]?.lang || 'en';
      const name = lang === 'en' ? p.name_en : p.name_ru;

      await ctx.answerCbQuery(`✅ ${name} ${getSizeWeight(s.id)} added!`);
      await ctx.editMessageText(formatProductCard(p, lang), {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: (() => {
            const sizeButtons = sizes.map(sz => {
              const pk = getPriceKey(sz.id);
              return Markup.button.callback(
                `${sz.label} — ${p[pk]} ฿`,
                `add_${p.id}_${sz.id}`
              );
            });
            const btns = [];
            for (let i = 0; i < sizeButtons.length; i += 2) {
              btns.push(sizeButtons.slice(i, i + 2));
            }
            btns.push([
              Markup.button.callback(t(chatId, '🔙 Back', '🔙 Назад'), `cat_${p.cat}`),
              Markup.button.callback(t(chatId, '🛒 Cart', '🛒 Корзина'), 'cart'),
            ]);
            return btns;
          })()
        }
      });
    });
  });
});

// CART
bot.action('cart', async (ctx) => {
  const chatId = ctx.chat.id;
  const text = formatCartText(chatId);
  if (!text) {
    await ctx.editMessageText(
      t(chatId, '🛒 Your cart is empty', '🛒 Ваша корзина пуста'),
      { parse_mode: 'Markdown', ...mainMenu(chatId) }
    );
    return;
  }

  const cart = userState[chatId].cart;
  const buttons = [];

  // Item controls
  cart.forEach((item, idx) => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      buttons.push([
        Markup.button.callback(
          `➖`, `cart_dec_${idx}`,
        ),
        Markup.button.callback(
          `${item.qty}`, `cart_qty_${idx}`
        ),
        Markup.button.callback(
          `➕`, `cart_inc_${idx}`
        ),
        Markup.button.callback(
          `🗑️`, `cart_del_${idx}`
        ),
      ]);
    }
  });

  buttons.push([
    Markup.button.callback(t(chatId, '🛍️ Continue Shopping', '🛍️ Продолжить'), 'shop'),
    Markup.button.callback(t(chatId, '🗑️ Clear', '🗑️ Очистить'), 'clear_cart'),
  ]);
  buttons.push([
    Markup.button.callback(t(chatId, '✅ Checkout', '✅ Оформить'), 'checkout'),
  ]);

  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
});

// Cart controls
bot.action(/^cart_inc_(\d+)$/, async (ctx) => {
  const chatId = ctx.chat.id;
  const idx = parseInt(ctx.match[1]);
  const cart = userState[chatId]?.cart;
  if (cart && cart[idx]) cart[idx].qty += 1;
  await ctx.answerCbQuery('+1');
  await ctx.editMessageText(formatCartText(chatId), {
    parse_mode: 'Markdown',
    reply_markup: (await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, ctx.callbackQuery.message.message_id, undefined)).reply_markup
  });
  // Re-render
  await ctx.editMessageText(formatCartText(chatId), {
    parse_mode: 'Markdown',
    reply_markup: (() => {
      const cart = userState[chatId]?.cart || [];
      const buttons = [];
      cart.forEach((item, idx) => {
        buttons.push([
          Markup.button.callback('➖', `cart_dec_${idx}`),
          Markup.button.callback(`${item.qty}`, `cart_qty_${idx}`),
          Markup.button.callback('➕', `cart_inc_${idx}`),
          Markup.button.callback('🗑️', `cart_del_${idx}`),
        ]);
      });
      buttons.push([
        Markup.button.callback(t(chatId, '🛍️ Continue Shopping', '🛍️ Продолжить'), 'shop'),
        Markup.button.callback(t(chatId, '🗑️ Clear', '🗑️ Очистить'), 'clear_cart'),
      ]);
      buttons.push([
        Markup.button.callback(t(chatId, '✅ Checkout', '✅ Оформить'), 'checkout'),
      ]);
      return { inline_keyboard: buttons };
    })()
  });
});

bot.action(/^cart_dec_(\d+)$/, async (ctx) => {
  const chatId = ctx.chat.id;
  const idx = parseInt(ctx.match[1]);
  const cart = userState[chatId]?.cart;
  if (cart && cart[idx]) {
    cart[idx].qty -= 1;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
  }
  await ctx.answerCbQuery('-1');
  // Re-render cart
  const text = formatCartText(chatId);
  if (!text) {
    await ctx.editMessageText(t(chatId, '🛒 Cart empty', '🛒 Корзина пуста'), mainMenu(chatId));
    return;
  }
  const newCart = userState[chatId]?.cart || [];
  const buttons = [];
  newCart.forEach((item, i) => {
    buttons.push([
      Markup.button.callback('➖', `cart_dec_${i}`),
      Markup.button.callback(`${item.qty}`, `cart_qty_${i}`),
      Markup.button.callback('➕', `cart_inc_${i}`),
      Markup.button.callback('🗑️', `cart_del_${i}`),
    ]);
  });
  buttons.push([
    Markup.button.callback(t(chatId, '🛍️ Continue Shopping', '🛍️ Продолжить'), 'shop'),
    Markup.button.callback(t(chatId, '🗑️ Clear', '🗑️ Очистить'), 'clear_cart'),
  ]);
  buttons.push([
    Markup.button.callback(t(chatId, '✅ Checkout', '✅ Оформить'), 'checkout'),
  ]);
  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
});

bot.action('clear_cart', async (ctx) => {
  const chatId = ctx.chat.id;
  if (userState[chatId]) userState[chatId].cart = [];
  await ctx.editMessageText(
    t(chatId, '🗑️ Cart cleared!', '🗑️ Корзина очищена!'),
    { parse_mode: 'Markdown', ...mainMenu(chatId) }
  );
});

// CHECKOUT → Select delivery region
bot.action('checkout', async (ctx) => {
  const chatId = ctx.chat.id;
  const text = formatCartText(chatId);
  if (!text) {
    await ctx.editMessageText(t(chatId, '🛒 Cart empty', '🛒 Корзина пуста'), mainMenu(chatId));
    return;
  }

  const subtotal = getCartTotal(chatId);

  const buttons = deliveryRegions.map(r => [
    Markup.button.callback(
      `${r.name_en} (+${r.price} ฿)`,
      `delivery_${r.id}`
    )
  ]);

  await ctx.editMessageText(
    `${text}\n\n📍 *${t(chatId, 'Select delivery area:', 'Выберите район доставки:')}*`,
    { parse_mode: 'Markdown', reply_markup: { inline_keyboard: buttons } }
  );
});

// Delivery region selected → Show payment
deliveryRegions.forEach(region => {
  bot.action(`delivery_${region.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    userState[chatId].deliveryRegion = region;
    const subtotal = getCartTotal(chatId);
    const total = subtotal + region.price;

    const text = formatCartText(chatId);
    const msg = `${text}\n\n📍 *Delivery:* ${region.name_en} (+${region.price} THB)\n💰 *Total: ${total.toLocaleString()} THB*\n\n${t(chatId, '💳 *Choose payment method:*', '💳 *Выберите способ оплаты:*')}`;

    const buttons = paymentMethods.map(m => [
      Markup.button.callback(
        `${m.icon} ${m.name_en}`,
        `pay_${m.id}`
      )
    ]);

    await ctx.editMessageText(msg, {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  });
});

// Payment method selected → Confirm
paymentMethods.forEach(method => {
  bot.action(`pay_${method.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    userState[chatId].paymentMethod = method;

    const subtotal = getCartTotal(chatId);
    const region = userState[chatId].deliveryRegion || deliveryRegions[0];
    const total = subtotal + region.price;

    let paymentInfo = '';
    if (method.id === 'qrcode') {
      paymentInfo = t(chatId,
        '📱 Pay via PromptPay QR when courier arrives',
        '📱 Оплатите по PromptPay QR когда приедет курьер'
      );
    } else if (method.id === 'cash') {
      paymentInfo = t(chatId,
        '💵 Pay in cash to the courier upon delivery',
        '💵 Заплатите наличными курьеру при получении'
      );
    } else {
      paymentInfo = t(chatId,
        '₿ Pay with USDT/BTC\nSend crypto after order confirmation',
        '₿ Оплатите USDT/BTC\nОтправьте крипту после подтверждения заказа'
      );
    }

    const msg = `${formatCartText(chatId)}\n\n📍 ${region.name_en} (+${region.price} THB)\n💳 *${method.icon} ${method.name_en}*\n📝 ${paymentInfo}\n\n💰 *Total: ${total.toLocaleString()} THB*\n\n${t(chatId, '✅ Confirm order?', '✅ Подтвердить заказ?')}`;

    await ctx.editMessageText(msg, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(t(chatId, '✅ Confirm Order', '✅ Подтвердить заказ'), 'confirm_order')],
          [Markup.button.callback(t(chatId, '❌ Cancel', '❌ Отмена'), 'cart')],
        ]
      }
    });
  });
});

// CONFIRM ORDER
bot.action('confirm_order', async (ctx) => {
  const chatId = ctx.chat.id;
  const state = userState[chatId];
  const cart = state?.cart || [];
  const region = state?.deliveryRegion || deliveryRegions[0];
  const method = state?.paymentMethod || paymentMethods[0];
  const lang = state?.lang || 'en';

  let total = 0;
  let orderText = `🛒 *New Order - Parvati Weed Thailand*\n━━━━━━━━━━━━━━━━\n\n`;

  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      const priceKey = getPriceKey(item.size);
      const unitPrice = p[priceKey] || 0;
      const itemTotal = unitPrice * item.qty;
      total += itemTotal;
      orderText += `• ${p.name_en} (${getSizeWeight(item.size)}) × ${item.qty} = ${itemTotal.toLocaleString()} THB\n`;
    }
  });

  orderText += `\n━━━━━━━━━━━━━━━━\n`;
  orderText += `📍 Delivery: ${region.name_en} (+${region.price} THB)\n`;
  orderText += `💳 Payment: ${method.icon} ${method.name_en}\n`;
  orderText += `💰 Total: ${(total + region.price).toLocaleString()} THB\n\n`;
  orderText += `👤 User: [${chatId}](tg://user?id=${chatId})\n`;
  orderText += `🌐 Lang: ${lang}`;

  // Send to admin
  await ctx.telegram.sendMessage(ADMIN_ID, orderText, { parse_mode: 'Markdown' });

  // Send user confirmation
  let confirmMsg = t(chatId,
    `✅ *Order confirmed!*\n\nWe will contact you shortly via Telegram 📲\n\nTotal: ${(total + region.price).toLocaleString()} THB\nPayment: ${method.icon} ${method.name_en}`,
    `✅ *Заказ подтверждён!*\n\nМы свяжемся с вами в Telegram 📲\n\nСумма: ${(total + region.price).toLocaleString()} THB\nОплата: ${method.icon} ${method.name_en}`
  );

  if (method.id === 'qrcode') {
    confirmMsg += '\n\n' + t(chatId, '📱 Have the QR ready when courier arrives', '📱 Приготовьте QR для курьера');
  } else if (method.id === 'cash') {
    confirmMsg += '\n\n' + t(chatId, '💵 Have exact change ready', '💵 Приготовьте сумму без сдачи');
  } else {
    confirmMsg += '\n\n' + t(chatId, '₿ We will send wallet address for payment', '₿ Мы отправим адрес кошелька для оплаты');
  }

  // Clear state
  userState[chatId].cart = [];
  delete userState[chatId].deliveryRegion;
  delete userState[chatId].paymentMethod;

  await ctx.editMessageText(confirmMsg, {
    parse_mode: 'Markdown',
    ...mainMenu(chatId)
  });
});

// NAV BACK
bot.action('back_main', async (ctx) => {
  const chatId = ctx.chat.id;
  const cart = userState[chatId]?.cart || [];
  const cartBadge = cart.length > 0 ? ` 🛒(${cart.reduce((s,i) => s + i.qty, 0)})` : '';
  await ctx.editMessageText(
    t(chatId, '🌿 *Main Menu*', '🌿 *Главное меню*'),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(t(chatId, '🛍️ Shop / Menu', '🛍️ Магазин / Меню'), 'shop')],
          [Markup.button.callback(`${t(chatId, '🛒 Cart', '🛒 Корзина')}${cartBadge}`, 'cart')],
          [Markup.button.callback(t(chatId, '🌍 Language', '🌍 Язык'), 'change_lang')],
        ]
      }
    }
  );
});

// === LAUNCH ===
if (!BOT_TOKEN) {
  console.log('❌ Set BOT_TOKEN environment variable');
  process.exit(1);
}

bot.launch();
console.log('🚀 Parvati Weed Bot v2.0 Premium — Running...');
console.log(`👤 Admin ID: ${ADMIN_ID}`);
console.log(`📦 Products: ${products.length}`);
console.log(`🌐 Categories: ${categories.map(c => c.name_en).join(', ')}`);

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));