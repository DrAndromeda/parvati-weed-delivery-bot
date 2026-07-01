#!/usr/bin/env node
// 🌿 Parvati Weed Bot — v3.2 с картинками товаров + исправленная система размеров
const { Telegraf, Markup } = require('telegraf');
const { products, categories } = require('./products_spar_city_v2');
const path = require('path');
const fs = require('fs');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ADMIN_ID = Number(process.env.ADMIN_ID || '237228075');

// ─── Система размеров (исправленная) ───
const DELIVERY = [
  { id: 'bangkok', en: '📍 Bangkok',ru: '📍 Бангкок', price: 100 },
  { id: 'phuket', en: '📍 Phuket',ru: '📍 Пхукет', price: 300 },
  { id: 'samui', en: '📍 Koh Samui',ru: '📍 Самуи', price: 400 },
  { id: 'phangan', en: '📍 Koh Phangan',ru: '📍 Панган', price: 500 },
];

const PAYMENTS = [
  { id: 'qr', icon: '🇹🇭', en: 'PromptPay QR', ru: 'PromptPay QR' },
  { id: 'cash', icon: '💵', en: 'Cash to courier', ru: 'Наличные курьеру' },
  { id: 'crypto', icon: '₿', en: 'Crypto USDT/BTC', ru: 'Крипта USDT/BTC' },
];

const SIZES = [
  { id:'joint',  label:'🚬 Joint', wt:1 },
  { id:'gram',   label:'🌱 1g',    wt:1 },
  { id:'eighth', label:'🔥 3.5g',  wt:3.5 },
  { id:'fiveg',  label:'⭐ 5g',    wt:5 },
  { id:'quarter',label:'🌈 7g',    wt:7 },
  { id:'teng',   label:'💫 10g',   wt:10 },
  { id:'half',   label:'💎 14g',   wt:14 },
  { id:'ounce',  label:'👑 28g',   wt:28 },
];

const SIZE_KEY = {
  joint:'price_joint', gram:'price_gram', eighth:'price_8th',
  fiveg:'price_8th', quarter:'price_quarter', teng:'price_quarter',
  half:'price_half', ounce:'price_ounce'
};

function SIZE_WT(id) {
  const s = SIZES.find(x => x.id === id);
  return s ? `${s.wt}g` : '1g';
}

function getPrice(p, sizeId) {
  const s = SIZES.find(x => x.id === sizeId);
  if (!s) return 0;
  const key = SIZE_KEY[sizeId];
  const base = p[key];
  // Для 5g и 10g — price_gram * weight
  if (['fiveg','teng'].includes(sizeId)) return Math.round(p.price_gram * s.wt);
  return base || Math.round(p.price_gram * s.wt);
}

function fmtSize(p, sizeId) {
  const price = getPrice(p, sizeId);
  const s = SIZES.find(x => x.id === sizeId);
  return `${s.label} — ${price}฿`;
}

const user = {};
function lang(chatId) { return user[chatId]?.lang || 'en'; }
function t(chatId, en, ru) { return lang(chatId) === 'en' ? en : ru; }

function total(chatId) {
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
      text += `${idx+1}. ${p.name_en} ${SIZE_WT(i.size)} ×${i.qty} — ${itemSum}฿\n`;
    }
  });
  text += `\n💰 *Total: ${sum} THB*`;
  return text;
}

function menu(chatId) {
  const c = user[chatId]?.cart || [];
  const badge = c.length ? ` (${c.reduce((s,i)=>s+i.qty,0)})` : '';
  return {
    reply_markup: {
      inline_keyboard: [
        [Markup.button.callback('🛍️ Menu', 'shop')],
        [Markup.button.callback(`🛒 Cart${badge}`, 'cart'), Markup.button.callback('❓ FAQ', 'faq')],
        [Markup.button.callback('🌍 EN/RU', 'lang_menu')],
      ]
    }
  };
}

// ─── БОТ ───
const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  const buttons = [
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
  ];
  const caption = t(chatId,
    '🌿 *Welcome to Parvati Weed Thailand*\nPremium cannabis & kratom delivery 🚀\n🇬🇧 English / 🇷🇺 Русский',
    '🌿 *Добро пожаловать в Parvati Weed Thailand*\nПремиум доставка травы и кратома 🚀\n🇬🇧 English / 🇷🇺 Русский'
  );
  const defImg = path.join(__dirname, 'product_default.png');
  if (fs.existsSync(defImg)) {
    await ctx.replyWithPhoto({ source: defImg }, {
      caption, parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: buttons }
    });
  } else {
    await ctx.reply(caption, { parse_mode:'Markdown', reply_markup:{ inline_keyboard: buttons } });
  }
});

bot.action('lang_en', async (ctx) => {
  user[ctx.chat.id] = { lang:'en', cart:[] };
  await ctx.editMessageText('🌿 *Welcome!* 🌿\n\nChoose from the menu below 👇', { parse_mode:'Markdown', ...menu(ctx.chat.id) });
});

bot.action('lang_ru', async (ctx) => {
  user[ctx.chat.id] = { lang:'ru', cart:[] };
  await ctx.editMessageText('🌿 *Добро пожаловать!* 🌿\n\nВыберите в меню ниже 👇', { parse_mode:'Markdown', ...menu(ctx.chat.id) });
});

bot.action('lang_menu', async (ctx) => {
  await ctx.editMessageText('🌍 Language:', {
    reply_markup: { inline_keyboard: [
      [Markup.button.callback('🇬🇧 English', 'lang_en'), Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
    ]}
  });
});

bot.action('shop', async (ctx) => {
  const chatId = ctx.chat.id;
  const btns = categories.map(c => [Markup.button.callback(c.name_en, `cat_${c.id}`)]);
  btns.push([Markup.button.callback(t(chatId,'🔙 Back','🔙 Назад'), 'back')]);
  await ctx.editMessageText(t(chatId, '📋 *Category:*', '📋 *Категория:*'), { parse_mode:'Markdown', reply_markup:{ inline_keyboard:btns } });
});

categories.forEach(cat => {
  bot.action(`cat_${cat.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    const pp = products.filter(p => p.cat === cat.id);
    const btns = pp.map(p => [Markup.button.callback(`${p.grade} ${p.name_en}`, `view_${p.id}`)]);
    btns.push([Markup.button.callback(t(chatId,'🔙 Back','🔙 Назад'), 'shop')]);
    await ctx.editMessageText(`${cat.name_en}\n${t(chatId,'Select:','Выберите:')}`, { reply_markup:{ inline_keyboard:btns } });
  });
});

products.forEach(p => {
  bot.action(`view_${p.id}`, async (ctx) => {
    const chatId = ctx.chat.id;
    const isEn = lang(chatId) === 'en';
    let text = `✦ *${p.name_en}* ✦\n🏆 ${p.grade} | 🌸 ${p.type}\n\n${isEn ? p.description_en : p.description_ru}\n\n✨ ${p.effects.map(e=>`#${e.replace(/\s/g,'')}`).join(' ')}\n\n💰 *Prices:*\n`;
    SIZES.forEach(s => {
      text += `${s.label} — ${getPrice(p, s.id)}฿\n`;
    });
    text += `\n📦 ${p.stock}g`;

    const sb = SIZES.map(s => Markup.button.callback(`${s.label} ${getPrice(p, s.id)}฿`, `add_${p.id}_${s.id}`));
    const rows = [];
    for (let i=0; i<sb.length; i+=2) rows.push(sb.slice(i,i+2));
    rows.push([
      Markup.button.callback(t(chatId,'🔙 Back','🔙 Назад'), `cat_${p.cat}`),
      Markup.button.callback('🛒 Cart', 'cart'),
    ]);

    // Отправляем с картинкой если есть
    const imgPath = path.join(__dirname, p.image);
    if (p.image && fs.existsSync(imgPath)) {
      await ctx.deleteMessage().catch(()=>{});
      await ctx.replyWithPhoto({ source: imgPath }, {
        caption: text,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: rows }
      });
    } else {
      await ctx.editMessageText(text, { parse_mode:'Markdown', reply_markup:{ inline_keyboard:rows } });
    }
  });
});

// Обработчик добавления в корзину — для всех размеров
SIZES.forEach(s => {
  bot.action(/^add_/, async (ctx) => {
    const data = ctx.match ? ctx.match[0] : ctx.callbackQuery.data;
    const parts = data.replace('add_','').split('_');
    const pid = parts[0];
    const sizeId = parts.slice(1).join('_');
    const p = products.find(x => x.id === pid);
    if (!p) { await ctx.answerCbQuery('❌ Error'); return; }
    const chatId = ctx.chat.id;
    if (!user[chatId]) user[chatId] = { lang:'en', cart:[] };
    const ex = user[chatId].cart.find(i => i.id===pid && i.size===sizeId);
    if (ex) ex.qty++;
    else user[chatId].cart.push({ id:pid, size:sizeId, qty:1 });
    await ctx.answerCbQuery(`✅ ${p.name_en} ${SIZE_WT(sizeId)} +1`);

    // Перерисовка карточки
    const isEn = lang(chatId)==='en';
    let text = `✦ *${p.name_en}* ✦\n🏆 ${p.grade} | 🌸 ${p.type}\n\n${isEn ? p.description_en : p.description_ru}\n\n✨ ${p.effects.map(e=>`#${e.replace(/\s/g,'')}`).join(' ')}\n\n💰 *Prices:*\n`;
    SIZES.forEach(sz => {
      text += `${sz.label} — ${getPrice(p, sz.id)}฿\n`;
    });
    text += `\n📦 ${p.stock}g`;
    const sb = SIZES.map(sz => Markup.button.callback(`${sz.label} ${getPrice(p, sz.id)}฿`, `add_${pid}_${sz.id}`));
    const rows = [];
    for (let i=0; i<sb.length; i+=2) rows.push(sb.slice(i,i+2));
    rows.push([
      Markup.button.callback(t(chatId,'🔙 Back','🔙 Назад'), `cat_${p.cat}`),
      Markup.button.callback('🛒 Cart', 'cart'),
    ]);
    await ctx.editMessageText(text, { parse_mode:'Markdown', reply_markup:{ inline_keyboard:rows } });
  });
});

bot.action('cart', async (ctx) => {
  const chatId = ctx.chat.id;
  const text = cartText(chatId);
  if (!text) {
    await ctx.editMessageText(t(chatId,'🛒 Empty','🛒 Пусто'), { parse_mode:'Markdown', ...menu(chatId) });
    return;
  }
  const rows = [];
  (user[chatId]?.cart||[]).forEach((item,idx) => {
    rows.push([
      Markup.button.callback('➖', `dec_${idx}`),
      Markup.button.callback(`${item.qty}`, `q_${idx}`),
      Markup.button.callback('➕', `inc_${idx}`),
      Markup.button.callback('🗑️', `del_${idx}`),
    ]);
  });
  rows.push([
    Markup.button.callback(t(chatId,'🛍️ Menu','🛍️ Меню'), 'shop'),
    Markup.button.callback(t(chatId,'🗑️ Clear','🗑️ Очистить'), 'clear'),
  ]);
  rows.push([Markup.button.callback(t(chatId,'✅ Order','✅ Заказ'), 'checkout')]);
  await ctx.editMessageText(text, { parse_mode:'Markdown', reply_markup:{ inline_keyboard:rows } });
});

bot.action(/^inc_(\d+)$/, async (ctx) => {
  const chatId=ctx.chat.id, idx=parseInt(ctx.match[1]);
  if (user[chatId]?.cart?.[idx]) user[chatId].cart[idx].qty++;
  await ctx.answerCbQuery('+1');
  rebuildCart(ctx, chatId);
});

bot.action(/^dec_(\d+)$/, async (ctx) => {
  const chatId=ctx.chat.id, idx=parseInt(ctx.match[1]);
  if (user[chatId]?.cart?.[idx]) {
    user[chatId].cart[idx].qty--;
    if (user[chatId].cart[idx].qty<=0) user[chatId].cart.splice(idx,1);
  }
  await ctx.answerCbQuery('-1');
  rebuildCart(ctx, chatId);
});

async function rebuildCart(ctx, chatId) {
  const text=cartText(chatId);
  if (!text) { await ctx.editMessageText(t(chatId,'🛒 Empty','🛒 Пусто'), { parse_mode:'Markdown', ...menu(chatId) }); return; }
  const rows=[];
  (user[chatId]?.cart||[]).forEach((item,i)=>{
    rows.push([Markup.button.callback('➖',`dec_${i}`),Markup.button.callback(`${item.qty}`,`q_${i}`),Markup.button.callback('➕',`inc_${i}`),Markup.button.callback('🗑️',`del_${i}`)]);
  });
  rows.push([Markup.button.callback(t(chatId,'🛍️ Menu','🛍️ Меню'),'shop'),Markup.button.callback(t(chatId,'🗑️ Clear','🗑️ Очистить'),'clear')]);
  rows.push([Markup.button.callback(t(chatId,'✅ Order','✅ Заказ'),'checkout')]);
  await ctx.editMessageText(text,{parse_mode:'Markdown',reply_markup:{inline_keyboard:rows}});
}

bot.action('clear', async (ctx) => {
  const chatId=ctx.chat.id;
  if (user[chatId]) user[chatId].cart=[];
  await ctx.editMessageText(t(chatId,'🗑️ Cleared!','🗑️ Очищено!'), { parse_mode:'Markdown', ...menu(chatId) });
});

bot.action('checkout', async (ctx) => {
  const chatId=ctx.chat.id;
  const text=cartText(chatId);
  if (!text) { await ctx.editMessageText(t(chatId,'🛒 Empty','🛒 Пусто'), { parse_mode:'Markdown', ...menu(chatId) }); return; }
  const btns = DELIVERY.map(d => [Markup.button.callback(`${d.en} +${d.price}฿`, `del_${d.id}`)]);
  await ctx.editMessageText(`${text}\n\n📍 ${t(chatId,'Delivery:','Доставка:')}`, { parse_mode:'Markdown', reply_markup:{ inline_keyboard:btns } });
});

DELIVERY.forEach(d => {
  bot.action(`del_${d.id}`, async (ctx) => {
    const chatId=ctx.chat.id;
    user[chatId].delivery=d;
    const subtotal=total(chatId), totalSum=subtotal+d.price;
    const text=`${cartText(chatId)}\n\n📍 ${d.en} +${d.price}฿\n💰 *Total: ${totalSum} THB*\n\n${t(chatId,'💳 Payment:','💳 Оплата:')}`;
    const btns=PAYMENTS.map(m=>[Markup.button.callback(`${m.icon} ${m.en}`, `pay_${m.id}`)]);
    await ctx.editMessageText(text, { parse_mode:'Markdown', reply_markup:{ inline_keyboard:btns } });
  });
});

PAYMENTS.forEach(m => {
  bot.action(`pay_${m.id}`, async (ctx) => {
    const chatId=ctx.chat.id;
    user[chatId].payment=m;
    const subtotal=total(chatId);
    const d=user[chatId].delivery||DELIVERY[0];
    const totalSum=subtotal+d.price;
    const text=`${cartText(chatId)}\n\n📍 ${d.en} +${d.price}฿\n💳 *${m.icon} ${m.en}*\n💵 ${t(chatId,'Total:','Итого:')} *${totalSum} THB*\n\n${t(chatId,'Confirm?','Подтвердить?')}`;
    await ctx.editMessageText(text,{
      parse_mode:'Markdown',
      reply_markup:{ inline_keyboard:[
        [Markup.button.callback(t(chatId,'✅ Confirm','✅ Подтвердить'),'confirm')],
        [Markup.button.callback(t(chatId,'❌ Cancel','❌ Отмена'),'cart')],
      ]}
    });
  });
});

bot.action('confirm', async (ctx) => {
  const chatId=ctx.chat.id;
  const s=user[chatId], cart=s?.cart||[], d=s?.delivery||DELIVERY[0], m=s?.payment||PAYMENTS[0];
  let sum=0;
  let order=`🛒 *New Order*\n━━━━━━━━━━\n`;
  cart.forEach(i=>{
    const p=products.find(x=>x.id===i.id);
    if (p){
      const pr=getPrice(p,i.size), st=pr*i.qty;
      sum+=st;
      order+=`• ${p.name_en} (${SIZE_WT(i.size)})×${i.qty}=${st}฿\n`;
    }
  });
  order+=`━━━━━━━━━━\n📍 ${d.en}+${d.price}฿\n💳 ${m.icon} ${m.en}\n💰 *${sum+d.price} THB*\n\n👤 User: [${chatId}](tg://user?id=${chatId})`;
  await ctx.telegram.sendMessage(ADMIN_ID, order, { parse_mode:'Markdown' });
  user[chatId].cart=[];
  delete user[chatId].delivery;
  delete user[chatId].payment;
  await ctx.editMessageText(t(chatId,`✅ *Done!* ${sum+d.price} THB\nWe'll contact you 📲`,`✅ *Готово!* ${sum+d.price} THB\nСвяжемся 📲`),{parse_mode:'Markdown',...menu(chatId)});
});

bot.action('faq', async (ctx) => {
  const chatId=ctx.chat.id;
  const isEn=lang(chatId)==='en';
  const faqs=[
    {q:isEn?'🚀 Delivery time':'🚀 Время доставки', a:isEn?'30-60 min Bangkok, 60-120 min other':'30-60 мин Бангкок, 60-120 мин другие'},
    {q:'💳 Payment', a:isEn?'PromptPay QR, cash, crypto (USDT/BTC)':'PromptPay QR, наличные, крипта (USDT/BTC)'},
    {q:isEn?'🕐 Hours':'🕐 Часы', a:isEn?'Daily 10:00-23:00':'Ежедневно 10:00-23:00'},
    {q:isEn?'📦 Min order':'📦 Мин. заказ', a:'300 THB'},
    {q:isEn?'🔒 Packaging':'🔒 Упаковка', a:isEn?'Discreet, unmarked':'Дискретная, без маркировки'},
  ];
  let text=isEn?'*❓ FAQ*\n\n':'*❓ FAQ*\n\n';
  faqs.forEach(f=>{text+=`${f.q}\n${f.a}\n\n`;});
  text+=isEn?'📞 Contact us after ordering!':'📞 Свяжитесь после заказа!';
  await ctx.editMessageText(text,{parse_mode:'Markdown',reply_markup:{inline_keyboard:[[Markup.button.callback(t(chatId,'🔙 Back','🔙 Назад'),'back')]]}});
});

bot.action('back', async (ctx) => {
  await ctx.editMessageText(t(ctx.chat.id,'🌿 *Main Menu*','🌿 *Главное меню*'),{parse_mode:'Markdown',...menu(ctx.chat.id)});
});

if (!BOT_TOKEN) { console.error('❌ No token'); process.exit(1); }
bot.launch();
console.log('🚀 Parvati Weed — v3.2');
console.log(`Admin: ${ADMIN_ID} | Products: ${products.length} | Images: ✓`);
process.once('SIGINT',()=>bot.stop('SIGINT'));
process.once('SIGTERM',()=>bot.stop('SIGTERM'));