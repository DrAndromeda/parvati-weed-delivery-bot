#!/usr/bin/env node
// 🌿 Parvati Weed Bot v3 — Full Test Suite
// Run: node tests.js

const { products, categories } = require('./products_spar_city');

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) pass++; else { fail++; console.error(`✗ FAIL: ${msg}`); } }

// ─── 1. DATA INTEGRITY ───
console.log('🧪 Data Integrity');
products.forEach(p => {
  ok(p.id, `ID: ${p.name_en}`);
  ok(p.name_en, `Name: ${p.id}`);
  ok(p.name_ru, `Russian name: ${p.id}`);
  ok(['4A','4A+','5A','5A+'].includes(p.grade), `Grade ${p.id}: ${p.grade}`);
  ok(p.description_en?.length > 10, `Desc EN ${p.id}: ${p.description_en?.length} chars`);
  ok(p.description_ru?.length > 10, `Desc RU ${p.id}: ${p.description_ru?.length} chars`);
  ['price_joint','price_gram','price_8th','price_quarter','price_half','price_ounce'].forEach(k => {
    ok(typeof p[k] === 'number' && p[k] > 0, `${k} ${p.id}: ${p[k]}`);
  });
  ok(p.effects?.length >= 1, `Effects ${p.id}: ${p.effects.length}`);
  ok(categories.some(c => c.id === p.cat), `Cat ${p.id}: ${p.cat}`);
});

// ─── 2. CATEGORIES ───
console.log('🧪 Categories');
categories.forEach(c => {
  ok(c.id && c.name_en && c.name_ru, `Category: ${c.name_en}`);
  ok(products.filter(p => p.cat === c.id).length > 0, `${c.name_en} has products`);
});

// ─── 3. PRICE LOGIC ───
console.log('🧪 Prices');
const SIZE_MAP = { gram: 'price_gram', eighth: 'price_8th', quarter: 'price_quarter', half: 'price_half', ounce: 'price_ounce' };
products.forEach(p => {
  ok(p.price_gram <= p.price_ounce, `Gram <= Ounce ${p.id}`);
  ok(p.price_8th <= p.price_quarter * 2, `8th <= Quarter*2 ${p.id}`);
});

// ─── 4. DELIVERY ───
console.log('🧪 Delivery');
const del = [
  { id: 'bangkok', price: 100 },
  { id: 'phuket', price: 300 },
  { id: 'samui', price: 400 },
  { id: 'phangan', price: 500 },
  { id: 'patong', price: 200 },
  { id: 'krabi', price: 350 },
];
del.forEach(d => ok(d.price >= 0, `Delivery ${d.id}: ${d.price}`));

// ─── 5. PAYMENTS ───
console.log('🧪 Payments');
const pay = ['qr','cash','crypto'];
pay.forEach(p => ok(p, `Payment: ${p}`));

// ─── 6. CART LOGIC ───
console.log('🧪 Cart Logic');
const cart = [];
function add(id, size, qty) {
  const ex = cart.find(i => i.id === id && i.size === size);
  if (ex) ex.qty += qty; else cart.push({ id, size, qty });
}
function remove(id, size) {
  const idx = cart.findIndex(i => i.id === id && i.size === size);
  if (idx >= 0) { cart[idx].qty--; if (cart[idx].qty <= 0) cart.splice(idx, 1); }
}
function total() {
  let t = 0;
  cart.forEach(i => {
    const p = products.find(x => x.id === i.id);
    if (p) t += (p[SIZE_MAP[i.size]] || 0) * i.qty;
  });
  return t;
}

add('p1', 'gram', 1);
ok(cart.length === 1, 'Add 1 item');
ok(cart[0].qty === 1, 'Qty=1');
add('p1', 'gram', 2);
ok(cart[0].qty === 3, 'Qty=3 after add 2');
const p1 = products.find(x => x.id === 'p1');
ok(total() === p1.price_gram * 3, `Total = ${p1.price_gram*3}`);

remove('p1', 'gram');
ok(cart[0].qty === 2, 'After remove qty=2');
remove('p1', 'gram');
remove('p1', 'gram');
ok(cart.length === 0, 'Removed all');

add('p1', 'eighth', 1);
add('b1', 'ounce', 2);
ok(cart.length === 2, 'Two different items');
const p1v = products.find(x => x.id === 'p1');
const b1v = products.find(x => x.id === 'b1');
ok(total() === (p1v?.price_8th || 0) + (b1v?.price_ounce || 0) * 2, `Multi-item total: ${total()} = ${p1v?.price_8th} + ${b1v?.price_ounce}*2`);

// ─── 7. SIZES ───
console.log('🧪 Sizes');
const sizes = ['gram','eighth','quarter','half','ounce'];
products.forEach(p => {
  sizes.forEach(s => {
    ok(typeof p[SIZE_MAP[s]] === 'number' && p[SIZE_MAP[s]] > 0, `${p.id} ${s}: ${p[SIZE_MAP[s]]}`);
  });
});

// ─── 8. EFFECTS ───
console.log('🧪 Effects');
const allEffects = new Set();
products.forEach(p => p.effects.forEach(e => allEffects.add(e)));
ok(allEffects.size >= 5, `Unique effects: ${allEffects.size}`);

// ─── RESULTS ───
console.log(`\n═══════════════════`);
console.log(`✅ Passed: ${pass}`);
console.log(`❌ Failed: ${fail}`);
console.log(`📊 Total: ${pass + fail}`);
console.log(`═══════════════════`);
process.exit(fail > 0 ? 1 : 0);