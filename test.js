// Parvati Weed Bot — Module Test
const { categories, products, getGroupName, getSiblingIds, getSiblingSizes, isSizeVariant } = require('./products');

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${msg}`);
  }
}

console.log('🔍 Testing products.js module...\n');

// Categories
assert(categories.length === 5, '5 categories');
assert(categories.find(c => c.id === 'flower') !== undefined, 'flower category exists');
assert(categories.find(c => c.id === 'kratom') !== undefined, 'kratom category exists');

// Products
assert(products.length > 30, `products count: ${products.length}`);
const allIds = new Set(products.map(p => p.id));
assert(allIds.size === products.length, `all ${products.length} product IDs are unique`);

// Each product has required fields
products.forEach(p => {
  assert(typeof p.id === 'string' && p.id.length > 0, `product ${p.id} has id`);
  assert(typeof p.name_en === 'string' && p.name_en.length > 0, `product ${p.id} has name_en`);
  assert(typeof p.name_ru === 'string' && p.name_ru.length > 0, `product ${p.id} has name_ru`);
  assert(typeof p.price === 'number' && p.price > 0, `product ${p.id} has valid price (${p.price})`);
  assert(typeof p.desc_en === 'string' && p.desc_en.length > 5, `product ${p.id} has desc_en (${p.desc_en.length} chars)`);
  assert(typeof p.desc_ru === 'string' && p.desc_ru.length > 5, `product ${p.id} has desc_ru (${p.desc_ru.length} chars)`);
  assert(typeof p.cat === 'string' && p.cat.length > 0, `product ${p.id} has cat`);
  assert(categories.find(c => c.id === p.cat) !== undefined, `product ${p.id} category '${p.cat}' is valid`);
});

// Size variants
const f1 = products.find(p => p.id === 'f1');
assert(f1 !== undefined, 'f1 exists');
assert(f1.name_en.includes('OG Kush'), `f1 name_en includes OG Kush: "${f1.name_en}"`);

const f1Group = getGroupName('f1');
assert(f1Group !== null, 'f1 belongs to a size group');
assert(f1Group === 'OG Kush', `f1 group is OG Kush, got: ${f1Group}`);

const f1Siblings = getSiblingSizes('f1');
assert(f1Siblings.length >= 3, `OG Kush has at least 3 sizes, got: ${f1Siblings.length}`);

assert(isSizeVariant('f1') === true, 'f1 is size variant');
assert(isSizeVariant('f8') === false, 'f8 (Blue Dream standalone) is NOT size variant');
assert(isSizeVariant('k1') === false, 'k1 (Kratom) is NOT size variant');
assert(isSizeVariant('e1') === false, 'e1 (Edible) is NOT size variant');

// Group names
assert(getGroupName('f1') === 'OG Kush', 'f1 → OG Kush');
assert(getGroupName('f4') === 'Amnesia Haze', 'f4 → Amnesia Haze');
assert(getGroupName('f6') === 'Northern Lights', 'f6 → Northern Lights');
assert(getGroupName('f9') === 'Gelato', 'f9 → Gelato');
assert(getGroupName('f11') === 'Thai Stick', 'f11 → Thai Stick');
assert(getGroupName('f8') === null, 'f8 standalone → null');
assert(getGroupName('k1') === null, 'k1 → null');

// Standalone products
const f8 = products.find(p => p.id === 'f8');
assert(f8 !== undefined, 'f8 (Blue Dream) exists');
assert(f8.name_en === 'Blue Dream 1g', 'f8 is Blue Dream 1g');
assert(f8.desc_en.includes('THC'), 'f8 description includes THC%');
assert(f8.desc_en.includes('berry') || f8.desc_en.includes('vanilla'), 'f8 description includes flavor');

// Check all flower products are covered
console.log('\n🔍 Flower product coverage...');
const flowerProducts = products.filter(p => p.cat === 'flower');
const grouped = new Set();
const standaloneNames = [];
flowerProducts.forEach(p => {
  if (isSizeVariant(p.id)) grouped.add(getGroupName(p.id));
  else standaloneNames.push(p.name_en);
});
console.log(`  Grouped strains: ${[...grouped].join(', ')}`);
console.log(`  Standalone: ${standaloneNames.join(', ')}`);

// Verify callback data patterns won't exceed 64 chars
console.log('\n🔍 Checking callback data lengths...');
const allGroupNames = new Set();
products.forEach(p => {
  if (isSizeVariant(p.id)) {
    const gn = getGroupName(p.id);
    if (gn) allGroupNames.add(gn);
  }
});

const deliveryRegions = [
  { id: 'bangkok' }, { id: 'phuket' }, { id: 'samui' }, { id: 'pangyan' }
];

const cbPatterns = [];
categories.forEach(c => cbPatterns.push(`cat_${c.id}`));
products.forEach(p => cbPatterns.push(`add_${p.id}`));
allGroupNames.forEach(gn => {
  // Same encoding as bot.js: replace spaces with underscores
  const encoded = gn.replace(/\s+/g, '_');
  cbPatterns.push(`group_${encoded}`);
});
deliveryRegions.forEach(r => cbPatterns.push(`delivery_${r.id}`));

// Static patterns
['shop', 'cart', 'clear_cart', 'confirm_order', 'back_main', 'change_lang',
 'lang_en', 'lang_ru', 'pay_promptpay', 'pay_cash', 'pay_crypto', 'noop'].forEach(p => cbPatterns.push(p));

cbPatterns.forEach(cb => {
  if (cb.length > 64) {
    console.error(`  ❌ OVER 64 chars: "${cb}" (${cb.length})`);
    failed++;
  } else if (cb.length > 50) {
    console.log(`  ⚠️  Long: "${cb}" (${cb.length} chars)`);
  } else {
    // too many to show, just pass
  }
});

// Summary
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
process.exit(failed > 0 ? 1 : 0);