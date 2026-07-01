// Parvati weed Thailand — Full version with size selection, PromptPay QR, cash, crypto
const { Telegraf, Markup } = require('telegraf');
const { categories, products, getSiblingSizes, isSizeVariant, getGroupName } = require('./products');
const QRCode = require('qrcode');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ADMIN_ID = Number(process.env.ADMIN_ID || '237228075');

// Config
const PROMPTPAY_PHONE = '0812345678'; // Replace with actual PromptPay number
const USDT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678'; // Replace
const BTC_ADDRESS = 'bc1qxyz...'; // Replace

// Delivery regions
const deliveryRegions = [
  { id: 'bangkok',  name_en: 'Bangkok',  name_ru: 'Бангкок',  price: 100 },
  { id: 'phuket',   name_en: 'Phuket',   name_ru: 'Пхукет',   price: 500 },
  { id: 'samui',    name_en: 'Samui',    name_ru: 'Самуи',    price: 600 },
  { id: 'pangyan',  name_en: 'Pangyan',  name_ru: 'Панган',   price: 700 },
];

const userState = {};

function t(chatId, en, ru) {
  const lang = userState[chatId]?.lang || 'en';
  return lang === 'ru' ? ru : en;
}

// Build a clean cart text
function buildCartText(chatId) {
  const cart = userState[chatId]?.cart || [];
  if (cart.length === 0) return null;
  let text = t(chatId, '🛒 *Your Cart:*\n\n', '🛒 *Ваша корзина:*\n\n');
  let total = 0;
  (cart || []).forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      const itemTotal = p.price * item.qty;
      total += itemTotal;
      text += `• ${p.name_en} × ${item.qty} = ${itemTotal} THB\n`;
      text += `  _${p.desc_en.substring(0, 60)}_\n\n`;
    }
  });
  text += `💰 *Total: ${total} THB*`;
  return { text, total };
}

function mainMenu(chatId) {
  return {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(t(chatId, '🛍️ Shop', '🛍️ Магазин'), 'shop')],
        [Markup.button.callback(t(chatId, '🛒 Cart', '🛒 Корзина'), 'cart')],
        [Markup.button.callback(t(chatId, '🌍 Language', '🌍 Язык'), 'change_lang')],
      ]
    }
  };
}

// ===================== BOT =====================
const bot = new Telegraf(BOT_TOKEN);

// ---------- START ----------
bot.start(async (ctx) => {
  const buttons = [
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
  ];
  await ctx.reply('🌿 Welcome to Parvati weed Thailand!\nChoose your language / Выберите язык:', {
    reply_markup: { inline_keyboard: buttons }
  });
});

// ---------- LANGUAGE ----------
bot.action('lang_en', async (ctx) => {
  const chatId = ctx.chat.id;
  userState[chatId] = { lang: 'en', cart: [] };
  await ctx.editMessageText('🌿 Welcome to Parvati weed Thailand!', mainMenu(chatId));
});

bot.action('lang_ru', async (ctx) => {
  const chatId = ctx.chat.id;
  userState[chatId] = { lang: 'ru', cart: [] };
  await ctx.editMessageText('🌿 Добро пожаловать в Parvati weed Thailand!', mainMenu(chatId));
});

// ---------- LANGUAGE SWITCH ----------
bot.action('change_lang', async (ctx) => {
  const buttons = [
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
  ];
  await ctx.editMessageText('Choose your language / Выберите язык:', {
    reply_markup: { inline_keyboard: buttons }
  });
});

// ---------- SHOP - CATEGORIES ----------
bot.action('shop', async (ctx) => {
  const chatId = ctx.chat.id;
  const buttons = categories.map(cat => [
    Markup.button.callback(cat.name_en, `cat_${cat.id}`)
  ]);
  buttons.push([Markup.button.callback(t(chatId, '🔙 Main Menu', '🔙 Главное меню'), 'back_main')]);
  await ctx.editMessageText(
    t(chatId, '🌿 *Choose a category:*', '🌿 *Выберите категорию:*'),
    { reply_markup: { inline_keyboard: buttons }, parse_mode: 'Markdown' }
  );
});

// ---------- CATEGORY PRODUCTS ----------
categories.forEach(cat => {
  bot.action(`cat_${cat.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    const catProducts = products.filter(p => p.cat === cat.id);

    // Group size variants under a single row
    const seenGroups = new Set();
    const buttons = [];

    catProducts.forEach(p => {
      if (isSizeVariant(p.id)) {
        const groupName = getGroupName(p.id);
        if (!groupName || seenGroups.has(groupName)) return;
        seenGroups.add(groupName);
        // Find cheapest size for display price
        const sizes = getSiblingSizes(p.id);
        const minPrice = Math.min(...sizes.map(s => s.price));
        const cleanName = groupName.replace(/[^a-zA-Z0-9]/g, '');
        buttons.push([
          Markup.button.callback(`${groupName} from ${minPrice} THB`, `g_${cleanName}`)
        ]);
      } else {
        buttons.push([
          Markup.button.callback(`${p.name_en} - ${p.price} THB`, `add_${p.id}`)
        ]);
      }
    });

    buttons.push([Markup.button.callback(t(chatId, '🔙 Back', '🔙 Назад'), 'shop')]);
    await ctx.editMessageText(
      `${cat.name_en} / ${cat.name_ru}\n${t(chatId, 'Choose product:', 'Выберите товар:')}`,
      { reply_markup: { inline_keyboard: buttons } }
    );
  });
});

// ---------- SIZE GROUP MENU ----------
// We'll register dynamically for all unique group names
const allGroupNames = new Set();
products.forEach(p => {
  if (isSizeVariant(p.id)) {
    const gn = getGroupName(p.id);
    if (gn) allGroupNames.add(gn);
  }
});

allGroupNames.forEach(groupName => {
  const cleanName = groupName.replace(/[^a-zA-Z0-9]/g, '');
  const cbData = `g_${cleanName}`;
  bot.action(cbData, async (ctx) => {
    const chatId = ctx.chat.id;
    // Find the sizes for this group
    const exampleProduct = products.find(p => isSizeVariant(p.id) && getGroupName(p.id) === groupName);
    if (!exampleProduct) return;
    const sizes = getSiblingSizes(exampleProduct.id);
    
    const buttons = sizes.map(s => {
      const p = products.find(pr => pr.id === s.id);
      if (!p) return [Markup.button.callback(`${s.size} - ${s.price} THB`, 'noop')];
      return [Markup.button.callback(`${s.size} - ${s.price} THB`, `add_${s.id}`)];
    });
    buttons.push([Markup.button.callback(t(chatId, '🔙 Back', '🔙 Назад'), 'shop')]);

    const text = t(chatId,
      `🌿 *${groupName}*\nChoose size:`,
      `🌿 *${groupName}*\nВыберите размер:`
    );
    await ctx.editMessageText(text, {
      reply_markup: { inline_keyboard: buttons },
      parse_mode: 'Markdown'
    });
  });
});

// ---------- ADD TO CART ----------
products.forEach(p => {
  bot.action(`add_${p.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    if (!userState[chatId]) userState[chatId] = { lang: 'en', cart: [] };
    const cart = userState[chatId].cart || [];
    const existing = cart.find(i => i.id === p.id);
    if (existing) existing.qty += 1;
    else cart.push({ id: p.id, qty: 1 });

    await ctx.answerCbQuery(
      t(chatId, `✅ Added ${p.name_en}`, `✅ Добавлено ${p.name_ru}`)
    );

    // Show what's in cart now as confirmation
    showCartInline(chatId, ctx, true);
  });
});

// ---------- SHOW CART ----------
async function showCartInline(chatId, ctx, isEdit = true) {
  const cart = userState[chatId]?.cart || [];
  if (!cart.length) {
    const text = t(chatId, '🛒 *Your cart is empty*', '🛒 *Ваша корзина пуста*');
    if (isEdit) {
      await ctx.editMessageText(text, { ...mainMenu(chatId), parse_mode: 'Markdown' });
    } else {
      await ctx.reply(text, { ...mainMenu(chatId), parse_mode: 'Markdown' });
    }
    return;
  }

  let text = t(chatId, '🛒 *Your Cart:*\n\n', '🛒 *Ваша корзина:*\n\n');
  let total = 0;
  cart.forEach((item, idx) => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      const itemTotal = p.price * item.qty;
      total += itemTotal;
      text += `${idx + 1}. ${p.name_en} × ${item.qty} = ${itemTotal} THB\n`;
      text += `   _${p.desc_en.substring(0, 50)}_\n`;
      text += `   ➖ [Remove one: /rm_${item.id}]\n\n`;
    }
  });
  text += `\n💰 *Total: ${total} THB*\n\n`;
  text += t(chatId, '📍 *Choose delivery region:*', '📍 *Выберите регион доставки:*');

  const regionButtons = deliveryRegions.map(region => [
    Markup.button.callback(`${region.name_en} (${region.price} THB)`, `delivery_${region.id}`)
  ]);
  regionButtons.push([
    Markup.button.callback(t(chatId, '🛍️ Continue Shopping', '🛍️ Продолжить'), 'shop'),
    Markup.button.callback(t(chatId, '🗑️ Clear Cart', '🗑️ Очистить'), 'clear_cart')
  ]);

  if (isEdit) {
    await ctx.editMessageText(text, {
      reply_markup: { inline_keyboard: regionButtons },
      parse_mode: 'Markdown'
    });
  } else {
    await ctx.reply(text, {
      reply_markup: { inline_keyboard: regionButtons },
      parse_mode: 'Markdown'
    });
  }
}

bot.action('cart', async (ctx) => {
  const chatId = ctx.chat.id;
  await showCartInline(chatId, ctx, true);
});

// ---------- CLEAR CART ----------
bot.action('clear_cart', async (ctx) => {
  const chatId = ctx.chat.id;
  if (userState[chatId]) userState[chatId].cart = [];
  await ctx.editMessageText(
    t(chatId, '🗑️ Cart cleared!', '🗑️ Корзина очищена!'),
    { ...mainMenu(chatId), parse_mode: 'Markdown' }
  );
});

// ---------- REMOVE ONE ITEM (text command) ----------
bot.hears(/^\/rm_(.+)$/, async (ctx) => {
  const chatId = ctx.chat.id;
  const itemId = ctx.match[1];
  if (!userState[chatId]) return;
  const cart = userState[chatId].cart || [];
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) {
      userState[chatId].cart = cart.filter(i => i.id !== itemId);
    }
  }
  await showCartInline(chatId, ctx, false);
});

// ---------- DELIVERY REGION SELECTION ----------
deliveryRegions.forEach(region => {
  bot.action(`delivery_${region.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    userState[chatId].deliveryRegion = region;
    const cart = userState[chatId]?.cart || [];
    let subtotal = 0;
    cart.forEach(item => {
      const p = products.find(pr => pr.id === item.id);
      if (p) subtotal += p.price * item.qty;
    });
    const finalTotal = subtotal + region.price;

    const text = t(chatId,
      `✅ *Order Summary:*\n\n` +
      `📍 Delivery: ${region.name_en} (${region.price} THB)\n` +
      `💵 Subtotal: ${subtotal} THB\n` +
      `💰 *Total: ${finalTotal} THB*\n\n` +
      `*Choose payment method:*`,
      `✅ *Итог заказа:*\n\n` +
      `📍 Доставка: ${region.name_ru} (${region.price} THB)\n` +
      `💵 Промежуточный итог: ${subtotal} THB\n` +
      `💰 *Общая сумма: ${finalTotal} THB*\n\n` +
      `*Выберите способ оплаты:*`
    );

    await ctx.editMessageText(text, {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('💳 PromptPay QR', 'pay_promptpay')],
          [Markup.button.callback('💵 Cash to courier', 'pay_cash')],
          [Markup.button.callback('₿ Crypto (USDT/BTC)', 'pay_crypto')],
          [Markup.button.callback(t(chatId, '❌ Cancel', '❌ Отмена'), 'cart')]
        ]
      },
      parse_mode: 'Markdown'
    });
  });
});

// ---------- PAYMENT: PROMPTPAY QR ----------
bot.action('pay_promptpay', async (ctx) => {
  const chatId = ctx.chat.id;
  const cart = userState[chatId]?.cart || [];
  const region = userState[chatId]?.deliveryRegion || deliveryRegions[0];
  let subtotal = 0;
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) subtotal += p.price * item.qty;
  });
  const total = subtotal + region.price;

  const qrUrl = `https://promptpay.io/${PROMPTPAY_PHONE}/${total}.png`;

  try {
    // Send QR as photo
    await ctx.editMessageText(
      t(chatId,
        `💳 *PromptPay Payment*\n\nAmount: ${total} THB\nScan the QR code below with your banking app.\n\n_After payment, click Confirm below._`,
        `💳 *Оплата PromptPay*\n\nСумма: ${total} THB\nОтсканируйте QR-код ниже через банковское приложение.\n\n_После оплаты нажмите Подтвердить._`
      ),
      { parse_mode: 'Markdown' }
    );

    await ctx.replyWithPhoto(
      { url: qrUrl },
      {
        caption: t(chatId,
          `🧾 *Parvati Weed — PromptPay*\nAmount: ${total} THB\nPhone: ${PROMPTPAY_PHONE}`,
          `🧾 *Parvati Weed — PromptPay*\nСумма: ${total} THB\nТелефон: ${PROMPTPAY_PHONE}`
        ),
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback(t(chatId, '✅ I Paid — Confirm Order', '✅ Я Оплатил — Подтвердить'), 'confirm_order')],
            [Markup.button.callback(t(chatId, '❌ Cancel', '❌ Отмена'), 'back_main')]
          ]
        }
      }
    );
  } catch (err) {
    // Fallback: send link to QR
    await ctx.reply(
      t(chatId,
        `💳 *PromptPay Payment*\n\nAmount: ${total} THB\nScan this QR:\n${qrUrl}\n\nOr use phone: ${PROMPTPAY_PHONE}\n\n_After payment, click Confirm._`,
        `💳 *Оплата PromptPay*\n\nСумма: ${total} THB\nСканируйте QR:\n${qrUrl}\n\nИли по телефону: ${PROMPTPAY_PHONE}\n\n_После оплаты нажмите Подтвердить._`
      ),
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback(t(chatId, '✅ I Paid — Confirm', '✅ Я Оплатил'), 'confirm_order')],
            [Markup.button.callback(t(chatId, '❌ Cancel', '❌ Отмена'), 'back_main')]
          ]
        }
      }
    );
  }
});

// ---------- PAYMENT: CASH ----------
bot.action('pay_cash', async (ctx) => {
  const chatId = ctx.chat.id;
  const text = t(chatId,
    `💵 *Cash Payment*\n\nYou selected **Cash to courier**.\n\nPay in cash when your order arrives.\n\nClick Confirm to place the order.`,
    `💵 *Наличные*\n\nВы выбрали **Наличные курьеру**.\n\nОплатите наличными при получении.\n\nНажмите Подтвердить для оформления заказа.`
  );
  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(t(chatId, '✅ Confirm Order', '✅ Подтвердить заказ'), 'confirm_order')],
        [Markup.button.callback(t(chatId, '❌ Cancel', '❌ Отмена'), 'back_main')]
      ]
    }
  });
});

// ---------- PAYMENT: CRYPTO ----------
bot.action('pay_crypto', async (ctx) => {
  const chatId = ctx.chat.id;
  const cart = userState[chatId]?.cart || [];
  const region = userState[chatId]?.deliveryRegion || deliveryRegions[0];
  let subtotal = 0;
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) subtotal += p.price * item.qty;
  });
  const total = subtotal + region.price;

  const text = t(chatId,
    `₿ *Crypto Payment*\n\n` +
    `Amount: ${total} THB\n\n` +
    `Send to one of these addresses:\n\n` +
    `*USDT (ERC20):*\n\`${USDT_ADDRESS}\`\n\n` +
    `*BTC:*\n\`${BTC_ADDRESS}\`\n\n` +
    `_After sending, click Confirm and we'll verify._`,
    `₿ *Оплата Криптой*\n\n` +
    `Сумма: ${total} THB\n\n` +
    `Отправьте на один из адресов:\n\n` +
    `*USDT (ERC20):*\n\`${USDT_ADDRESS}\`\n\n` +
    `*BTC:*\n\`${BTC_ADDRESS}\`\n\n` +
    `_После отправки нажмите Подтвердить, мы проверим._`
  );
  await ctx.editMessageText(text, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback(t(chatId, '✅ Sent — Confirm', '✅ Отправил — Подтвердить'), 'confirm_order')],
        [Markup.button.callback(t(chatId, '❌ Cancel', '❌ Отмена'), 'back_main')]
      ]
    }
  });
});

// ---------- CONFIRM ORDER ----------
bot.action('confirm_order', async (ctx) => {
  const chatId = ctx.chat.id;
  const state = userState[chatId];
  const cart = state?.cart || [];
  const region = state?.deliveryRegion || deliveryRegions[0];

  // Build order for admin
  let orderText = `🛒 *New Order — Parvati Weed Thailand*\n\n`;
  let total = 0;
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      const itemTotal = p.price * item.qty;
      total += itemTotal;
      orderText += `• ${p.name_en} × ${item.qty} = ${itemTotal} THB\n`;
    }
  });
  orderText += `\n📍 Delivery: ${region.name_en} (${region.price} THB)\n`;
  orderText += `💵 Subtotal: ${total} THB\n`;
  orderText += `💰 *Total: ${total + region.price} THB*\n\n`;
  orderText += `👤 User ID: \`${chatId}\`\n`;
  orderText += `🌐 Language: ${state?.lang || 'en'}`;

  try {
    await ctx.telegram.sendMessage(ADMIN_ID, orderText, { parse_mode: 'Markdown' });
  } catch (adminErr) {
    console.error('Failed to notify admin:', adminErr.message);
  }

  // Clear cart
  userState[chatId].cart = [];
  delete userState[chatId].deliveryRegion;

  const confirmText = t(chatId,
    `✅ *Order confirmed!* 🎉\n\nWe will contact you via Telegram shortly 📲\n\n` +
    `Thank you for choosing Parvati weed Thailand 🌿\n\n_Questions? Reply to this bot message._`,
    `✅ *Заказ подтверждён!* 🎉\n\nМы свяжемся с вами в Telegram 📲\n\n` +
    `Спасибо за выбор Parvati weed Thailand 🌿\n\n_Вопросы? Ответьте на это сообщение._`
  );

  await ctx.editMessageText(confirmText, {
    ...mainMenu(chatId),
    parse_mode: 'Markdown'
  });
});

// ---------- NAVIGATION ----------
bot.action('back_main', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText(
    t(chatId, '🌿 *Main Menu:*', '🌿 *Главное меню:*'),
    { ...mainMenu(chatId), parse_mode: 'Markdown' }
  );
});

// ---------- NOOP (catch-all for unused callbacks) ----------
bot.action('noop', async (ctx) => {
  await ctx.answerCbQuery();
});

// ---------- LAUNCH ----------
if (BOT_TOKEN) {
  bot.launch();
  console.log('🤖 Parvati weed Thailand bot running (full version with QR/cash/crypto)');
} else {
  console.log('❌ Set BOT_TOKEN env variable');
}
