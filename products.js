// Parvati 420 — Premium Botanical Collection
// Neutral descriptions for safety compliance
// Flat product list includes both standalone products and size-variant products.
// Size variants are grouped under a common strain name for size selection UI.

const categories = [
  { id: 'kratom',    name_en: '🍃 Kratom Collection', name_ru: '🍃 Коллекция Кратом' },
  { id: 'flower',    name_en: '🌿 Flower Strains',    name_ru: '🌿 Сорта Шишек' },
  { id: 'edibles',   name_en: '🍪 Edibles',           name_ru: '🍪 Эдиблс' },
  { id: 'prerolls',  name_en: '🚬 Pre-rolls',         name_ru: '🚬 Готовые косяки' },
  { id: 'accessory', name_en: '🔧 Accessories',       name_ru: '🔧 Аксессуары' },
];

// ===== FLAT PRODUCT LIST =====
// Every product here exists both as a standalone entry in the flat array,
// and (for flower strains with multiple sizes) as part of a size group.
const products = [
  // ---- KRATOM ----
  { id: 'k1', cat: 'kratom', name_en: 'Kratom Powder 10g', name_ru: 'Порошок Кратом 10г', price: 150, desc_en: 'Red/Green/White vein · Pure Thai powder · Mild energy boost · Best for beginners', desc_ru: 'Красный/Зелёный/Белый сорт · Чистый тайский порошок · Мягкий прилив энергии · Лучший для новичков' },
  { id: 'k2', cat: 'kratom', name_en: 'Kratom Powder 25g', name_ru: 'Порошок Кратом 25г', price: 300, desc_en: 'Red/Green/White vein · Medium pack · Balanced effects · Great value', desc_ru: 'Красный/Зелёный/Белый сорт · Средняя фасовка · Сбалансированный эффект · Отличная цена' },
  { id: 'k3', cat: 'kratom', name_en: 'Kratom Powder 50g', name_ru: 'Порошок Кратом 50г', price: 500, desc_en: 'Red/Green/White vein · Best value bulk · Long-lasting supply', desc_ru: 'Красный/Зелёный/Белый сорт · Лучшее соотношение цена/объём' },
  { id: 'k4', cat: 'kratom', name_en: 'Kratom Powder 100g', name_ru: 'Порошок Кратом 100г', price: 900, desc_en: 'Red/Green/White vein · Large bulk pack · Premium quality', desc_ru: 'Красный/Зелёный/Белый сорт · Большая фасовка · Премиум качество' },
  { id: 'k5', cat: 'kratom', name_en: 'Kratom Capsules 10pcs', name_ru: 'Капсулы Кратом 10шт', price: 200, desc_en: '500mg each · Easy to swallow · No bitter taste · Convenient dosing', desc_ru: 'По 500мг · Легко глотать · Нет горького вкуса · Удобная дозировка' },
  { id: 'k6', cat: 'kratom', name_en: 'Kratom Capsules 30pcs', name_ru: 'Капсулы Кратом 30шт', price: 500, desc_en: '500mg each · 1 month supply · Perfect for regular users', desc_ru: 'По 500мг · На 1 месяц · Идеально для регулярного приёма' },
  { id: 'k7', cat: 'kratom', name_en: 'Kratom Tea 5 bags', name_ru: 'Чай Кратом 5 пак.', price: 180, desc_en: 'Traditional brew · 3g per bag · Smooth, authentic taste', desc_ru: 'Традиционный напиток · 3г в пакетике · Мягкий, аутентичный вкус' },
  { id: 'k8', cat: 'kratom', name_en: 'Kratom Tea 20 bags', name_ru: 'Чай Кратом 20 пак.', price: 600, desc_en: 'Traditional brew · Box of 20 bags · Best value for tea lovers', desc_ru: 'Традиционный напиток · Коробка 20 пакетиков' },
  { id: 'k9', cat: 'kratom', name_en: 'Kratom Extract 5ml', name_ru: 'Экстракт Кратом 5мл', price: 400, desc_en: 'Concentrated liquid · Fast acting · 15x potency', desc_ru: 'Концентрированная жидкость · Быстрое действие · 15x сила' },
  { id: 'k10', cat: 'kratom', name_en: 'Kratom Extract 15ml', name_ru: 'Экстракт Кратом 15мл', price: 1000, desc_en: 'Premium concentrated extract · 15x potency · Best value', desc_ru: 'Премиум концентрированный экстракт · 15x сила' },

  // ---- FLOWER (size variants first, then standalone) ----
  // OG Kush (3 sizes)
  { id: 'f1', cat: 'flower', name_en: 'OG Kush 1g', name_ru: 'OG Kush 1г', price: 300, desc_en: 'Hybrid · Earthy, pine, citrus · Well-balanced', desc_ru: 'Гибрид · Землистый, сосна, цитрус · Сбалансированный' },
  { id: 'f2', cat: 'flower', name_en: 'OG Kush 3g', name_ru: 'OG Kush 3г', price: 800, desc_en: 'Hybrid · Best value 3g pack', desc_ru: 'Гибрид · Выгодная упаковка 3г' },
  { id: 'f3', cat: 'flower', name_en: 'OG Kush 5g', name_ru: 'OG Kush 5г', price: 1200, desc_en: 'Hybrid · Best deal 5g pack', desc_ru: 'Гибрид · Лучшая цена 5г' },
  // Amnesia Haze (2 sizes)
  { id: 'f4', cat: 'flower', name_en: 'Amnesia Haze 1g', name_ru: 'Amnesia Haze 1г', price: 250, desc_en: 'Sativa · Citrus, earthy · Energetic, creative', desc_ru: 'Сатива · Цитрус, земля · Бодрит, креатив' },
  { id: 'f5', cat: 'flower', name_en: 'Amnesia Haze 3g', name_ru: 'Amnesia Haze 3г', price: 700, desc_en: 'Sativa · 3g pack best value', desc_ru: 'Сатива · Упаковка 3г' },
  // Northern Lights (2 sizes)
  { id: 'f6', cat: 'flower', name_en: 'Northern Lights 1g', name_ru: 'Northern Lights 1г', price: 200, desc_en: 'Indica · Sweet, spicy · Deep relaxation', desc_ru: 'Индика · Сладкий, пряный · Глубокий релакс' },
  { id: 'f7', cat: 'flower', name_en: 'Northern Lights 3g', name_ru: 'Northern Lights 3г', price: 550, desc_en: 'Indica · 3g pack', desc_ru: 'Индика · Упаковка 3г' },
  // Blue Dream (standalone, no group)
  { id: 'f8', cat: 'flower', name_en: 'Blue Dream 1g', name_ru: 'Blue Dream 1г', price: 280, desc_en: 'Hybrid · Sweet berry, vanilla · Creative, uplifting', desc_ru: 'Гибрид · Сладкая ягода, ваниль · Креатив, подъём' },
  // Gelato (2 sizes)
  { id: 'f9', cat: 'flower', name_en: 'Gelato 1g', name_ru: 'Gelato 1г', price: 350, desc_en: 'Hybrid · Sweet, creamy, berry · Relaxed, happy', desc_ru: 'Гибрид · Сладкий, кремовый, ягода · Расслабление' },
  { id: 'f10', cat: 'flower', name_en: 'Gelato 3g', name_ru: 'Gelato 3г', price: 950, desc_en: 'Hybrid · Premium 3g pack', desc_ru: 'Гибрид · Премиум 3г' },
  // Thai Stick (2 sizes)
  { id: 'f11', cat: 'flower', name_en: 'Thai Stick 1g', name_ru: 'Thai Stick 1г', price: 80, desc_en: 'Sativa · Earthy, herbal · Light, budget-friendly', desc_ru: 'Сатива · Землистый, травяной · Лёгкий, бюджетный' },
  { id: 'f12', cat: 'flower', name_en: 'Thai Stick 5g', name_ru: 'Thai Stick 5г', price: 350, desc_en: 'Sativa · 5g pack best deal', desc_ru: 'Сатива · Упаковка 5г' },
  // Premium standalone strains
  { id: 'f13', cat: 'flower', name_en: 'Imperium X Black Berry Pop Pop', name_ru: 'Imperium X Black Berry Pop Pop', price: 1350, desc_en: 'Sativa 60% · Berry, diesel · Uplifting, energetic', desc_ru: 'Сатива 60% · Ягода, дизель · Подъём, энергия' },
  { id: 'f14', cat: 'flower', name_en: 'Black Berry Pop (2s)', name_ru: 'Black Berry Pop (2s)', price: 509, desc_en: 'Hybrid · Sweet berry, grape · Relaxed, happy', desc_ru: 'Гибрид · Сладкая ягода, виноград · Релакс' },
  { id: 'f15', cat: 'flower', name_en: 'OG Kush Face Off OG', name_ru: 'OG Kush Face Off OG', price: 800, desc_en: 'Hybrid · Diesel, pine, lemon · Potent, long-lasting', desc_ru: 'Гибрид · Дизель, сосна, лимон · Мощный, долгий' },

  // ---- EDIBLES ----
  { id: 'e1', cat: 'edibles', name_en: 'Gummy Bears 50mg', name_ru: 'Мармелад 50мг', price: 200, desc_en: '5 pieces · Fruity assorted flavors', desc_ru: '5 штук · Фруктовые вкусы' },
  { id: 'e2', cat: 'edibles', name_en: 'Gummy Bears 100mg', name_ru: 'Мармелад 100мг', price: 350, desc_en: '10 pieces · Fruity mix', desc_ru: '10 штук · Фруктовая смесь' },
  { id: 'e3', cat: 'edibles', name_en: 'Gummy Bears 200mg', name_ru: 'Мармелад 200мг', price: 600, desc_en: '20 pieces · Fruity mix', desc_ru: '20 штук · Фруктовая смесь' },
  { id: 'e4', cat: 'edibles', name_en: 'Choco Brownie 100mg', name_ru: 'Брауни 100мг', price: 250, desc_en: 'Rich dark chocolate brownie', desc_ru: 'Брауни из тёмного шоколада' },
  { id: 'e5', cat: 'edibles', name_en: 'Choco Brownie 200mg', name_ru: 'Брауни 200мг', price: 400, desc_en: 'Double strength dark chocolate', desc_ru: 'Двойная сила' },
  { id: 'e6', cat: 'edibles', name_en: 'Cookies 150mg', name_ru: 'Печенье 150мг', price: 300, desc_en: '4 cookies · Classic chocolate chip', desc_ru: '4 печенья · Классическое шоколадное' },

  // ---- PRE-ROLLS ----
  { id: 'p1', cat: 'prerolls', name_en: 'Joint 0.5g', name_ru: 'Косяк 0.5г', price: 100, desc_en: 'Premium · Single · Easy & convenient', desc_ru: 'Премиум · Один · Удобно' },
  { id: 'p2', cat: 'prerolls', name_en: 'Joint 1g', name_ru: 'Косяк 1г', price: 180, desc_en: 'Premium · King size', desc_ru: 'Премиум · Кинг сайз' },
  { id: 'p3', cat: 'prerolls', name_en: '3-Pack 0.5g', name_ru: '3-Pack 0.5г', price: 250, desc_en: '3 premium × 0.5g · Great value', desc_ru: '3 премиум по 0.5г · Выгодный набор' },
  { id: 'p4', cat: 'prerolls', name_en: '5-Pack 0.5g', name_ru: '5-Pack 0.5г', price: 400, desc_en: '5 premium × 0.5g · Best deal', desc_ru: '5 премиум по 0.5г · На компанию' },
  { id: 'p5', cat: 'prerolls', name_en: 'Infused Joint', name_ru: 'Премиум косяк', price: 350, desc_en: 'Premium infused · Triple threat', desc_ru: 'Премиум · Тройной удар' },

  // ---- ACCESSORIES ----
  { id: 'a1', cat: 'accessory', name_en: 'Rolling Papers 50', name_ru: 'Бумаги 50', price: 50, desc_en: 'King size slim · Ultra-thin · Natural gum', desc_ru: 'Кинг сайз слим · Ультратонкие · Натуральная камедь' },
  { id: 'a2', cat: 'accessory', name_en: 'Rolling Papers 100', name_ru: 'Бумаги 100', price: 80, desc_en: 'King size slim · Bulk pack of 100 sheets · Best value', desc_ru: 'Кинг сайз слим · 100 листов · Выгодно' },
  { id: 'a3', cat: 'accessory', name_en: 'Grinder Small', name_ru: 'Грайндер малый', price: 250, desc_en: '2-piece aluminum grinder · Compact · Magnetic lid', desc_ru: 'Алюминиевый 2-частный · Компактный · Магнитная крышка' },
  { id: 'a4', cat: 'accessory', name_en: 'Grinder Premium', name_ru: 'Грайндер премиум', price: 450, desc_en: '4-piece CNC aluminum · Kief catcher · Sharp teeth · Premium finish', desc_ru: '4-частный CNC алюминий · Сборщик кифа · Острые зубья' },
  { id: 'a5', cat: 'accessory', name_en: 'Glass Pipe', name_ru: 'Стеклянная трубка', price: 300, desc_en: 'Hand-blown borosilicate glass · Unique design · Easy to clean', desc_ru: 'Ручная работа из боросиликата · Уникальный дизайн' },
  { id: 'a6', cat: 'accessory', name_en: 'Bong Small', name_ru: 'Бонг малый', price: 800, desc_en: '20cm glass bong · Ice notch · Diffuser downstem · Smooth hits', desc_ru: '20см стеклянный бонг · Лёдоприёмник · Диффузор' },
  { id: 'a7', cat: 'accessory', name_en: 'Bong Large', name_ru: 'Бонг большой', price: 1500, desc_en: '40cm glass bong · Ice catcher · Percolator · Premium glass', desc_ru: '40см с ледоприёмником · Перколятор · Премиум стекло' },
  { id: 'a8', cat: 'accessory', name_en: 'Lighter 5pcs', name_ru: 'Зажигалки 5шт', price: 50, desc_en: 'Assorted colors · Reliable · Pocket-sized · Set of 5', desc_ru: 'Разные цвета · Надёжные · Карманные · Набор 5шт' },
];

// ===== SIZE GROUP DEFINITIONS =====
// Maps common strain names to their size variants (by product ID)
const sizeGroups = {
  'OG Kush': {
    ids: ['f1', 'f2', 'f3'],
    sizes: ['1g', '3g', '5g']
  },
  'Amnesia Haze': {
    ids: ['f4', 'f5'],
    sizes: ['1g', '3g']
  },
  'Northern Lights': {
    ids: ['f6', 'f7'],
    sizes: ['1g', '3g']
  },
  'Gelato': {
    ids: ['f9', 'f10'],
    sizes: ['1g', '3g']
  },
  'Thai Stick': {
    ids: ['f11', 'f12'],
    sizes: ['1g', '5g']
  }
};

// Helper: get the base group name (e.g. "OG Kush") for a product ID
function getGroupName(productId) {
  for (const [groupName, group] of Object.entries(sizeGroups)) {
    if (group.ids.includes(productId)) return groupName;
  }
  return null;
}

// Helper: get all sibling product IDs in the same size group
function getSiblingIds(productId) {
  for (const group of Object.values(sizeGroups)) {
    if (group.ids.includes(productId)) return group.ids;
  }
  return [productId];
}

// Helper: get all sibling product objects in the same size group
function getSiblingSizes(productId) {
  const ids = getSiblingIds(productId);
  return ids.map(id => products.find(p => p.id === id)).filter(Boolean);
}

// Helper: check if a product is part of a size group
function isSizeVariant(productId) {
  return getGroupName(productId) !== null;
}

// Helper: get the cheapest price in a group (for display)
function getGroupMinPrice(productId) {
  const siblings = getSiblingSizes(productId);
  if (!siblings.length) return null;
  return Math.min(...siblings.map(s => s.price));
}

module.exports = { categories, products, sizeGroups, getGroupName, getSiblingIds, getSiblingSizes, isSizeVariant, getGroupMinPrice };