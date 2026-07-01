// Parvati 420 — Premium Botanical Collection
// Rich product catalog with emoji sizing + detailed cards

const categories = [
  { id: 'kratom',    name_en: '🍃 Kratom Collection', name_ru: '🍃 Коллекция Кратом' },
  { id: 'flower',    name_en: '🌿 Flower Strains',    name_ru: '🌿 Сорта Шишек' },
  { id: 'edibles',   name_en: '🍪 Edibles',           name_ru: '🍪 Эдиблс' },
  { id: 'prerolls',  name_en: '🚬 Pre-rolls',         name_ru: '🚬 Готовые косяки' },
  { id: 'accessory', name_en: '🔧 Accessories',       name_ru: '🔧 Аксессуары' },
];

const products = [
  // ---- KRATOM ----
  { id: 'k1', cat: 'kratom', name_en: '🍃 Kratom Powder 10g', name_ru: '🍃 Порошок Кратом 10г', price: 150, size: '10г 📦', desc_en: 'Red/Green/White vein · Pure Thai powder · Mild energy boost · Best for beginners', desc_ru: 'Красный/Зелёный/Белый сорт · Чистый тайский порошок · Мягкий прилив энергии' },
  { id: 'k2', cat: 'kratom', name_en: '🍃 Kratom Powder 25g', name_ru: '🍃 Порошок Кратом 25г', price: 300, size: '25г 📦📦', desc_en: 'Medium pack · Balanced effects · Great value', desc_ru: 'Средняя фасовка · Сбалансированный эффект' },
  { id: 'k3', cat: 'kratom', name_en: '🍃 Kratom Powder 50g', name_ru: '🍃 Порошок Кратом 50г', price: 500, size: '50г 📦📦📦', desc_en: 'Best value bulk · Long-lasting supply', desc_ru: 'Лучшее соотношение цена/объём' },
  { id: 'k4', cat: 'kratom', name_en: '🍃 Kratom Powder 100g', name_ru: '🍃 Порошок Кратом 100г', price: 900, size: '100г 📦📦📦📦', desc_en: 'Large bulk pack · Premium quality', desc_ru: 'Большая фасовка · Премиум качество' },
  { id: 'k5', cat: 'kratom', name_en: '💊 Kratom Capsules 10pcs', name_ru: '💊 Капсулы Кратом 10шт', price: 200, size: '10 💊', desc_en: '500mg each · Easy to swallow · No bitter taste', desc_ru: 'По 500мг · Легко глотать' },
  { id: 'k6', cat: 'kratom', name_en: '💊 Kratom Capsules 30pcs', name_ru: '💊 Капсулы Кратом 30шт', price: 500, size: '30 💊💊💊', desc_en: '500mg each · 1 month supply', desc_ru: 'По 500мг · На 1 месяц' },
  { id: 'k7', cat: 'kratom', name_en: '🍵 Kratom Tea 5 bags', name_ru: '🍵 Чай Кратом 5 пак.', price: 180, size: '5 🍵', desc_en: 'Traditional brew · 3g per bag', desc_ru: 'Традиционный напиток · 3г в пакетике' },
  { id: 'k8', cat: 'kratom', name_en: '🍵 Kratom Tea 20 bags', name_ru: '🍵 Чай Кратом 20 пак.', price: 600, size: '20 🍵🍵', desc_en: 'Box of 20 bags', desc_ru: 'Коробка 20 пакетиков' },
  { id: 'k9', cat: 'kratom', name_en: '🧪 Kratom Extract 5ml', name_ru: '🧪 Экстракт Кратом 5мл', price: 400, size: '5мl 🧪', desc_en: 'Concentrated liquid · Fast acting', desc_ru: 'Концентрированная жидкость' },
  { id: 'k10', cat: 'kratom', name_en: '🧪 Kratom Extract 15ml', name_ru: '🧪 Экстракт Кратом 15мл', price: 1000, size: '15ml 🧪🧪', desc_en: 'Premium concentrated extract', desc_ru: 'Премиум концентрированный экстракт' },

  // ---- FLOWER ----
  { id: 'f1', cat: 'flower', name_en: '🌟 OG Kush 1g', name_ru: '🌟 OG Kush 1г', price: 300, size: '🌱 1g', desc_en: 'Hybrid · Earthy, pine, citrus · Well-balanced · Premium California genetics', desc_ru: 'Гибрид · Землистый, сосна, цитрус' },
  { id: 'f2', cat: 'flower', name_en: '🌟 OG Kush 3g', name_ru: '🌟 OG Kush 3г', price: 800, size: '🌿 3g', desc_en: 'Hybrid · Best value 3g pack', desc_ru: 'Гибрид · Выгодная упаковка 3г' },
  { id: 'f3', cat: 'flower', name_en: '🌟 OG Kush 5g', name_ru: '🌟 OG Kush 5г', price: 1200, size: '🌳 5g', desc_en: 'Hybrid · Best deal 5g pack', desc_ru: 'Гибрид · Лучшая цена 5г' },
  { id: 'f4', cat: 'flower', name_en: '✨ Amnesia Haze 1g', name_ru: '✨ Amnesia Haze 1г', price: 250, size: '🌱 1g', desc_en: 'Sativa · Citrus, earthy · Energetic, creative', desc_ru: 'Сатива · Цитрус, земля · Бодрит' },
  { id: 'f5', cat: 'flower', name_en: '✨ Amnesia Haze 3g', name_ru: '✨ Amnesia Haze 3г', price: 700, size: '🌿 3g', desc_en: 'Sativa · 3g pack', desc_ru: 'Сатива · Упаковка 3г' },
  { id: 'f6', cat: 'flower', name_en: '💜 Northern Lights 1g', name_ru: '💜 Northern Lights 1г', price: 200, size: '🌱 1g', desc_en: 'Indica · Sweet, spicy · Deep relaxation', desc_ru: 'Индика · Сладкий, пряный' },
  { id: 'f7', cat: 'flower', name_en: '💜 Northern Lights 3g', name_ru: '💜 Northern Lights 3г', price: 550, size: '🌿 3g', desc_en: 'Indica · 3g pack', desc_ru: 'Индика · Упаковка 3г' },
  { id: 'f8', cat: 'flower', name_en: '🫐 Blue Dream 1g', name_ru: '🫐 Blue Dream 1г', price: 280, size: '🌱 1g', desc_en: 'Hybrid · Sweet berry, vanilla · Creative, uplifting', desc_ru: 'Гибрид · Сладкая ягода, ваниль' },
  { id: 'f9', cat: 'flower', name_en: '🍦 Gelato 1g', name_ru: '🍦 Gelato 1г', price: 350, size: '🌱 1g', desc_en: 'Hybrid · Sweet, creamy, berry · Relaxed', desc_ru: 'Гибрид · Сладкий, кремовый' },
  { id: 'f10', cat: 'flower', name_en: '🍦 Gelato 3g', name_ru: '🍦 Gelato 3г', price: 950, size: '🌿 3g', desc_en: 'Hybrid · Premium 3g pack', desc_ru: 'Гибрид · Премиум 3г' },
  { id: 'f11', cat: 'flower', name_en: '🌴 Thai Stick 1g', name_ru: '🌴 Thai Stick 1г', price: 80, size: '🌱 1g', desc_en: 'Sativa · Earthy, herbal · Light', desc_ru: 'Сатива · Землистый, травяной' },
  { id: 'f12', cat: 'flower', name_en: '🌴 Thai Stick 5g', name_ru: '🌴 Thai Stick 5г', price: 350, size: '🌳 5g', desc_en: 'Sativa · 5g pack best deal', desc_ru: 'Сатива · Упаковка 5г' },
  { id: 'f13', cat: 'flower', name_en: '👑 Imperium X Black Berry', name_ru: '👑 Imperium X Black Berry', price: 1350, size: '🌱 1g', desc_en: 'Sativa · Berry, diesel · Uplifting · Premium exotic', desc_ru: 'Сатива · Ягода, дизель · Премиум' },
  { id: 'f14', cat: 'flower', name_en: '🍇 Black Berry Pop (2s)', name_ru: '🍇 Black Berry Pop (2s)', price: 509, size: '🌱 1g x2', desc_en: 'Hybrid · Sweet berry, grape · Relaxed', desc_ru: 'Гибрид · Ягода, виноград' },
  { id: 'f15', cat: 'flower', name_en: '🔥 OG Kush Face Off OG', name_ru: '🔥 OG Kush Face Off OG', price: 800, size: '🌱 1g', desc_en: 'Hybrid · Diesel, pine, lemon · Potent', desc_ru: 'Гибрид · Дизель, сосна, лимон' },

  // ---- EDIBLES ----
  { id: 'e1', cat: 'edibles', name_en: '🧸 Gummy Bears 50mg', name_ru: '🧸 Мармелад 50мг', price: 200, size: '5 🧸', desc_en: 'Fruity assorted flavors · Mild', desc_ru: 'Фруктовые вкусы' },
  { id: 'e2', cat: 'edibles', name_en: '🧸 Gummy Bears 100mg', name_ru: '🧸 Мармелад 100мг', price: 350, size: '10 🧸', desc_en: 'Fruity mix · Medium', desc_ru: 'Фруктовая смесь' },
  { id: 'e3', cat: 'edibles', name_en: '🧸 Gummy Bears 200mg', name_ru: '🧸 Мармелад 200мг', price: 600, size: '20 🧸', desc_en: 'Fruity mix · Strong', desc_ru: 'Фруктовая смесь · Сильный' },
  { id: 'e4', cat: 'edibles', name_en: '🍫 Choco Brownie 100mg', name_ru: '🍫 Брауни 100мг', price: 250, size: '1 🍫', desc_en: 'Rich dark chocolate brownie', desc_ru: 'Брауни из тёмного шоколада' },
  { id: 'e5', cat: 'edibles', name_en: '🍫 Choco Brownie 200mg', name_ru: '🍫 Брауни 200мг', price: 400, size: '1 🍫', desc_en: 'Double strength dark chocolate', desc_ru: 'Двойная сила' },
  { id: 'e6', cat: 'edibles', name_en: '🍪 Cookies 150mg', name_ru: '🍪 Печенье 150мг', price: 300, size: '4 🍪', desc_en: 'Classic chocolate chip', desc_ru: 'Классическое шоколадное' },

  // ---- PRE-ROLLS ----
  { id: 'p1', cat: 'prerolls', name_en: '🚬 Joint 0.5g', name_ru: '🚬 Косяк 0.5г', price: 100, size: '0.5г 🚬', desc_en: 'Premium · Single · Easy', desc_ru: 'Премиум · Один' },
  { id: 'p2', cat: 'prerolls', name_en: '🚬 Joint 1g', name_ru: '🚬 Косяк 1г', price: 180, size: '1г 🚬🚬', desc_en: 'Premium · King size', desc_ru: 'Премиум · Кинг' },
  { id: 'p3', cat: 'prerolls', name_en: '🚬 3-Pack 0.5g', name_ru: '🚬 3-Pack 0.5г', price: 250, size: '3 🚬', desc_en: '3 premium · Great value', desc_ru: '3 премиум · Выгодно' },
  { id: 'p4', cat: 'prerolls', name_en: '🚬 5-Pack 0.5g', name_ru: '🚬 5-Pack 0.5г', price: 400, size: '5 🚬', desc_en: '5 premium · Best deal', desc_ru: '5 премиум' },
  { id: 'p5', cat: 'prerolls', name_en: '💎 Infused Joint', name_ru: '💎 Премиум косяк', price: 350, size: '1 💎', desc_en: 'Premium infused · Triple threat', desc_ru: 'Премиум · Тройной' },

  // ---- ACCESSORIES ----
  { id: 'a1', cat: 'accessory', name_en: '📄 Rolling Papers 50', name_ru: '📄 Бумаги 50', price: 50, size: '50 📄', desc_en: 'King size slim · Ultra-thin', desc_ru: 'Кинг сайз · Ультратонкие' },
  { id: 'a2', cat: 'accessory', name_en: '📄 Rolling Papers 100', name_ru: '📄 Бумаги 100', price: 80, size: '100 📄', desc_en: 'King size · Bulk pack', desc_ru: 'Кинг сайз · 100 листов' },
  { id: 'a3', cat: 'accessory', name_en: '🌀 Grinder Small', name_ru: '🌀 Грайндер малый', price: 250, size: 'Малый 🌀', desc_en: '2-piece aluminum · Compact', desc_ru: 'Алюминиевый · Компактный' },
  { id: 'a4', cat: 'accessory', name_en: '🌀 Grinder Premium', name_ru: '🌀 Грайндер премиум', price: 450, size: 'Премиум 🌀', desc_en: '4-piece CNC · Kief catcher', desc_ru: '4-частный · Сборщик кифа' },
  { id: 'a5', cat: 'accessory', name_en: '🔮 Glass Pipe', name_ru: '🔮 Стеклянная трубка', price: 300, size: '🔮', desc_en: 'Hand-blown borosilicate', desc_ru: 'Ручная работа' },
  { id: 'a6', cat: 'accessory', name_en: '🏺 Bong Small', name_ru: '🏺 Бонг малый', price: 800, size: '20cm 🏺', desc_en: '20cm glass · Ice notch · Diffuser', desc_ru: '20см · Лёдоприёмник' },
  { id: 'a7', cat: 'accessory', name_en: '🏺 Bong Large', name_ru: '🏺 Бонг большой', price: 1500, size: '40cm 🏺🏺', desc_en: '40cm glass · Percolator', desc_ru: '40см · Перколятор' },
  { id: 'a8', cat: 'accessory', name_en: '🔥 Lighter 5pcs', name_ru: '🔥 Зажигалки 5шт', price: 50, size: '5 🔥', desc_en: 'Assorted colors · Set of 5', desc_ru: 'Разные цвета · Набор 5шт' },
];

// ===== SIZE GROUP DEFINITIONS =====
const sizeGroups = {
  'OG Kush': {
    ids: ['f1', 'f2', 'f3'],
    sizes: ['🌱 1g', '🌿 3g', '🌳 5g']
  },
  'Amnesia Haze': {
    ids: ['f4', 'f5'],
    sizes: ['🌱 1g', '🌿 3g']
  },
  'Northern Lights': {
    ids: ['f6', 'f7'],
    sizes: ['🌱 1g', '🌿 3g']
  },
  'Gelato': {
    ids: ['f9', 'f10'],
    sizes: ['🌱 1g', '🌿 3g']
  },
  'Thai Stick': {
    ids: ['f11', 'f12'],
    sizes: ['🌱 1g', '🌳 5g']
  }
};

// Helper: get the base group name (e.g. "OG Kush") for a product ID
function getGroupName(productId) {
  for (const [groupName, group] of Object.entries(sizeGroups)) {
    if (group.ids.includes(productId)) return groupName;
  }
  return null;
}

function getSiblingIds(productId) {
  for (const group of Object.values(sizeGroups)) {
    if (group.ids.includes(productId)) return group.ids;
  }
  return [productId];
}

function getSiblingSizes(productId) {
  const ids = getSiblingIds(productId);
  return ids.map(id => products.find(p => p.id === id)).filter(Boolean);
}

function isSizeVariant(productId) {
  return getGroupName(productId) !== null;
}

function getGroupMinPrice(productId) {
  const siblings = getSiblingSizes(productId);
  if (!siblings.length) return null;
  return Math.min(...siblings.map(s => s.price));
}

module.exports = { categories, products, sizeGroups, getGroupName, getSiblingIds, getSiblingSizes, isSizeVariant, getGroupMinPrice };