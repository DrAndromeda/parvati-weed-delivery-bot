// Parvati 420 — Premium botanical collection bot
const { Telegraf, Markup } = require('telegraf');
const { categories, products, getSiblingSizes, isSizeVariant, getGroupName } = require('./products');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ADMIN_ID = Number(process.env.ADMIN_ID || '237228075');

// Config
const PROMPTPAY_PHONE = '0812345678'; // Replace with actual PromptPay number
const USDT_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678'; // Replace
const BTC_ADDRESS = 'bc1qxyz...'; // Replace

// Set of users who failed age verification
const deniedUsers = new Set();

// Delivery regions
const deliveryRegions = [
  { id: 'bangkok',  name_en: 'Bangkok',  name_ru: 'Бангкок',  price: 100,  method: 'courier' },
  { id: 'phuket',   name_en: 'Phuket',   name_ru: 'Пхукет',   price: 500,  method: 'courier' },
  { id: 'samui',    name_en: 'Samui',    name_ru: 'Самуи',    price: 600,  method: 'courier' },
  { id: 'pangyan',  name_en: 'Pangyan',  name_ru: 'Панган',   price: 700,  method: 'courier' },
  { id: 'post',     name_en: 'Other (Post)', name_ru: 'Другие (Почта)', price: 300, method: 'post' },
];

const userState = {};

function t(chatId, en, ru) {
  const lang = userState[chatId]?.lang || 'en';
  return lang === 'ru' ? ru : en;
}

// ===== STATIC REPLY KEYBOARD =====
function staticKeyboard(chatId) {
  return Markup.keyboard([
    [t(chatId, '🛍️ Shop', '🛍️ Магазин'), t(chatId, '🛒 Cart', '🛒 Корзина')],
    [t(chatId, '🌍 Language', '🌍 Язык'), t(chatId, '❓ Help', '❓ Помощь')]
  ]).resize().persistent();
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

const bot = new Telegraf(BOT_TOKEN);

// ===== AGE VERIFICATION GATE =====
// Middleware to block denied users
bot.use(async (ctx, next) => {
  const chatId = ctx.chat?.id;
  if (chatId && deniedUsers.has(chatId)) {
    return; // Silently ignore
  }
  return next();
});

bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  
  // If already passed verification, go straight to language
  if (userState[chatId]?.verified) {
    const buttons = [
      [Markup.button.callback('🇬🇧 English', 'lang_en')],
      [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
    ];
    return ctx.reply('🌿 Welcome! / Добро пожаловать!\nChoose your language:', {
      reply_markup: { inline_keyboard: buttons }
    });
  }

  // Age verification
  await ctx.reply(
    '🌿 *Welcome to Parvati 420*\n\n' +
    'This is a premium botanical collection.\n' +
    'Please confirm you are 18+ to continue.\n\n' +
    '🌿 *Добро пожаловать в Parvati 420*\n' +
    'Это премиальная ботаническая коллекция.\n' +
    'Подтвердите, что вам есть 18 лет.',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback('✅ Yes / Да', 'age_yes')],
          [Markup.button.callback('❌ No / Нет', 'age_no')]
        ]
      }
    }
  );
});

bot.action('age_yes', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!userState[chatId]) userState[chatId] = {};
  userState[chatId].verified = true;

  const buttons = [
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
  ];
  await ctx.editMessageText('🌿 Welcome! / Добро пожаловать!\nChoose your language:', {
    reply_markup: { inline_keyboard: buttons }
  });
});

bot.action('age_no', async (ctx) => {
  const chatId = ctx.chat.id;
  deniedUsers.add(chatId);
  await ctx.editMessageText(
    '⛔ Access denied.\n' +
    'This content is only for adults 18+.\n\n' +
    '⛔ Доступ запрещён.\n' +
    'Контент предназначен для лиц старше 18 лет.\n\n' +
    '_You will not receive further messages._',
    { parse_mode: 'Markdown' }
  );
});

// ===== LANGUAGE =====
bot.action('lang_en', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!userState[chatId]) userState[chatId] = {};
  userState[chatId].lang = 'en';
  if (!userState[chatId].cart) userState[chatId].cart = [];
  if (!userState[chatId].verified) userState[chatId].verified = true;
  
  await ctx.editMessageText('🌿 Welcome to Parvati 420!', mainMenu(chatId));
  try { await ctx.reply('✅ Menu is always at the bottom!', staticKeyboard(chatId)); } catch(e) {}
});

bot.action('lang_ru', async (ctx) => {
  const chatId = ctx.chat.id;
  if (!userState[chatId]) userState[chatId] = {};
  userState[chatId].lang = 'ru';
  if (!userState[chatId].cart) userState[chatId].cart = [];
  if (!userState[chatId].verified) userState[chatId].verified = true;
  
  await ctx.editMessageText('🌿 Добро пожаловать в Parvati 420!', mainMenu(chatId));
  try { await ctx.reply('✅ Меню всегда внизу!', staticKeyboard(chatId)); } catch(e) {}
});

bot.action('change_lang', async (ctx) => {
  const buttons = [
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
  ];
  await ctx.editMessageText('Choose your language / Выберите язык:', {
    reply_markup: { inline_keyboard: buttons }
  });
});

// ===== TEXT HANDLERS =====
bot.hears(['🛍️ Shop', '🛍️ Магазин'], async (ctx) => {
  await showCategories(ctx.chat.id, ctx);
});

bot.hears(['🛒 Cart', '🛒 Корзина'], async (ctx) => {
  await showCartInline(ctx.chat.id, ctx, false);
});

bot.hears(['🌍 Language', '🌍 Язык'], async (ctx) => {
  const buttons = [
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
  ];
  await ctx.reply('Choose your language / Выберите язык:', {
    reply_markup: { inline_keyboard: buttons },
    ...staticKeyboard(ctx.chat.id)
  });
});

bot.hears(['❓ Help', '❓ Помощь'], async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.reply(
    t(chatId,
      '🌿 *Parvati 420 — Help*\n\n' +
      '• Browse our botanical collection\n' +
      '• Add items to cart\n' +
      '• Choose delivery method\n' +
      '• Pay via PromptPay, Cash, or Crypto\n\n' +
      'Questions? Contact @dr_Andromeda',
      '🌿 *Parvati 420 — Помощь*\n\n' +
      '• Листайте нашу ботаническую коллекцию\n' +
      '• Добавляйте в корзину\n' +
      '• Выбирайте способ доставки\n' +
      '• Оплата: PromptPay / Наличные / Крипта\n\n' +
      'Вопросы? @dr_Andromeda'
    ),
    { parse_mode: 'Markdown', ...staticKeyboard(chatId) }
  );
});

async function showCategories(chatId, ctx) {
  const buttons = categories.map(cat => [
    Markup.button.callback(cat.name_en, `cat_${cat.id}`)
  ]);
  buttons.push([Markup.button.callback(t(chatId, '🔙 Main Menu', '🔙 Главное меню'), 'back_main')]);
  await ctx.reply(
    t(chatId, '🌿 *Choose a category:*', '🌿 *Выберите категорию:*'),
    { reply_markup: { inline_keyboard: buttons }, parse_mode: 'Markdown', ...staticKeyboard(chatId) }
  );
}

// ===== SHOP =====
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

categories.forEach(cat => {
  bot.action(`cat_${cat.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    const catProducts = products.filter(p => p.cat === cat.id);
    const seenGroups = new Set();
    const buttons = [];

    catProducts.forEach(p => {
      if (isSizeVariant(p.id)) {
        const groupName = getGroupName(p.id);
        if (!groupName || seenGroups.has(groupName)) return;
        seenGroups.add(groupName);
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

products.forEach(p => {
  bot.action(`add_${p.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    if (!userState[chatId]) userState[chatId] = { lang: 'en', cart: [], verified: true };
    const cart = userState[chatId].cart || [];
    const existing = cart.find(i => i.id === p.id);
    if (existing) existing.qty += 1;
    else cart.push({ id: p.id, qty: 1 });

    await ctx.answerCbQuery(t(chatId, `✅ Added ${p.name_en}`, `✅ Добавлено ${p.name_ru}`));
    await showCartInline(chatId, ctx, true);
  });
});

// ===== CART =====
async function showCartInline(chatId, ctx, isEdit = true) {
  const cart = userState[chatId]?.cart || [];
  if (!cart.length) {
    const text = t(chatId, '🛒 *Your cart is empty*', '🛒 *Ваша корзина пуста*');
    const opts = { ...mainMenu(chatId), parse_mode: 'Markdown' };
    if (isEdit) {
      await ctx.editMessageText(text, opts);
    } else {
      await ctx.reply(text, { ...opts, ...staticKeyboard(chatId) });
    }
    return;
  }

  let text = t(chatId, '🛒 *Your Cart:*\n\n', '🛒 *Ваша корзина:*\n\n');
  let total = 0;
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      const itemTotal = p.price * item.qty;
      total += itemTotal;
      text += `• ${p.name_en} × ${item.qty} = ${itemTotal} THB\n`;
    }
  });
  text += `\n💰 *Total: ${total} THB*\n\n`;
  text += t(chatId, '📍 *Delivery options:*', '📍 *Варианты доставки:*');

  const regionButtons = deliveryRegions.map(region => [
    Markup.button.callback(
      `${region.name_en} — ${region.method === 'post' ? '📮 Post' : '🚚 Courier'} (${region.price} THB)`,
      `delivery_${region.id}`
    )
  ]);
  regionButtons.push([
    Markup.button.callback(t(chatId, '🛍️ Continue Shopping', '🛍️ Продолжить'), 'shop'),
    Markup.button.callback(t(chatId, '🗑️ Clear Cart', '🗑️ Очистить'), 'clear_cart')
  ]);

  const opts = { reply_markup: { inline_keyboard: regionButtons }, parse_mode: 'Markdown' };
  if (isEdit) {
    await ctx.editMessageText(text, opts);
  } else {
    await ctx.reply(text, { ...opts, ...staticKeyboard(chatId) });
  }
}

bot.action('cart', async (ctx) => {
  await showCartInline(ctx.chat.id, ctx, true);
});

bot.action('clear_cart', async (ctx) => {
  const chatId = ctx.chat.id;
  if (userState[chatId]) userState[chatId].cart = [];
  await ctx.editMessageText(
    t(chatId, '🗑️ Cart cleared!', '🗑️ Корзина очищена!'),
    { ...mainMenu(chatId), parse_mode: 'Markdown' }
  );
});

// ===== DELIVERY =====
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

    const methodIcon = region.method === 'post' ? '📮' : '🚚';
    const methodEn = region.method === 'post' ? 'Post delivery' : 'Courier delivery';
    const methodRu = region.method === 'post' ? 'Почтовая доставка' : 'Доставка курьером';

    const text = t(chatId,
      `✅ *Order Summary:*\n\n📍 ${region.name_en} ${methodIcon} ${methodEn} (${region.price} THB)\n💵 Subtotal: ${subtotal} THB\n💰 *Total: ${finalTotal} THB*\n\n*Choose payment method:*`,
      `✅ *Итог заказа:*\n\n📍 ${region.name_ru} ${methodIcon} ${methodRu} (${region.price} THB)\n💵 Промежуточный итог: ${subtotal} THB\n💰 *Общая сумма: ${finalTotal} THB*\n\n*Выберите способ оплаты:*`
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

// ===== PAYMENT: PROMPTPAY =====
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

  await ctx.editMessageText(
    t(chatId,
      `💳 *PromptPay*\nAmount: ${total} THB\nPay to: ${PROMPTPAY_PHONE}`,
      `💳 *PromptPay*\nСумма: ${total} THB\nТелефон: ${PROMPTPAY_PHONE}`
    ),
    { parse_mode: 'Markdown' }
  );

  try {
    await ctx.replyWithPhoto(
      { url: qrUrl },
      {
        caption: t(chatId,
          `Scan QR or send to ${PROMPTPAY_PHONE}`,
          `Сканируйте QR или отправьте на ${PROMPTPAY_PHONE}`
        ),
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback(t(chatId, '✅ I Paid', '✅ Я Оплатил'), 'confirm_order')],
            [Markup.button.callback(t(chatId, '❌ Cancel', '❌ Отмена'), 'back_main')]
          ]
        }
      }
    );
  } catch (err) {
    await ctx.reply(
      t(chatId,
        `QR: ${qrUrl}\nOr send to ${PROMPTPAY_PHONE}\n\nThen confirm.`,
        `QR: ${qrUrl}\nИли на ${PROMPTPAY_PHONE}\n\nПодтвердите.`
      ),
      {
        reply_markup: {
          inline_keyboard: [
            [Markup.button.callback(t(chatId, '✅ I Paid', '✅ Я Оплатил'), 'confirm_order')],
            [Markup.button.callback(t(chatId, '❌ Cancel', '❌ Отмена'), 'back_main')]
          ]
        }
      }
    );
  }
});

// ===== PAYMENT: CASH =====
bot.action('pay_cash', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText(
    t(chatId,
      `💵 *Cash*\nPay when order arrives.`,
      `💵 *Наличные*\nОплата при получении.`
    ),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(t(chatId, '✅ Confirm', '✅ Подтвердить'), 'confirm_order')],
          [Markup.button.callback(t(chatId, '❌ Cancel', '❌ Отмена'), 'back_main')]
        ]
      }
    }
  );
});

// ===== PAYMENT: CRYPTO =====
bot.action('pay_crypto', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText(
    t(chatId,
      `₿ *Crypto*\n\nUSDT (ERC20):\n\`${USDT_ADDRESS}\`\n\nBTC:\n\`${BTC_ADDRESS}\``,
      `₿ *Крипта*\n\nUSDT (ERC20):\n\`${USDT_ADDRESS}\`\n\nBTC:\n\`${BTC_ADDRESS}\``
    ),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(t(chatId, '✅ Sent', '✅ Отправил'), 'confirm_order')],
          [Markup.button.callback(t(chatId, '❌ Cancel', '❌ Отмена'), 'back_main')]
        ]
      }
    }
  );
});

// ===== CONFIRM ORDER =====
bot.action('confirm_order', async (ctx) => {
  const chatId = ctx.chat.id;
  const state = userState[chatId];
  const cart = state?.cart || [];
  const region = state?.deliveryRegion || deliveryRegions[0];

  let orderText = `🛒 *New Order — Parvati 420*\n\n`;
  let total = 0;
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (p) {
      const itemTotal = p.price * item.qty;
      total += itemTotal;
      orderText += `• ${p.name_en} × ${item.qty} = ${itemTotal} THB\n`;
    }
  });
  const methodIcon = region.method === 'post' ? '📮' : '🚚';
  orderText += `\n${methodIcon} ${region.name_en} (${region.price} THB, ${region.method})\n`;
  orderText += `💰 *Total: ${total + region.price} THB*\n\n`;
  orderText += `👤 User ID: \`${chatId}\`\n🌐 ${state?.lang || 'en'}`;

  try {
    await ctx.telegram.sendMessage(ADMIN_ID, orderText, { parse_mode: 'Markdown' });
  } catch (e) {}

  userState[chatId].cart = [];
  delete userState[chatId].deliveryRegion;

  await ctx.editMessageText(
    t(chatId,
      `✅ *Order confirmed!* 🎉\nWe'll contact you soon 📲`,
      `✅ *Заказ подтверждён!* 🎉\nМы свяжемся 📲`
    ),
    { ...mainMenu(chatId), parse_mode: 'Markdown' }
  );
  try { await ctx.reply('✅ Menu is always below 👇', staticKeyboard(chatId)); } catch(e) {}
});

// ===== NAV =====
bot.action('back_main', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.editMessageText(
    t(chatId, '🌿 *Main Menu:*', '🌿 *Главное меню:*'),
    { ...mainMenu(chatId), parse_mode: 'Markdown' }
  );
});

bot.action('noop', async (ctx) => {
  await ctx.answerCbQuery();
});

// ===== LAUNCH =====
if (BOT_TOKEN) {
  bot.launch();
  console.log('🤖 Parvati 420 bot running — age gate + static menu');
} else {
  console.log('❌ Set BOT_TOKEN env variable');
}