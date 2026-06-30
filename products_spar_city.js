// 🌿 Spar City - Premium Cannabis Products (from choochoohemp API)
// Top 20 popular products curated for @Parvati_WeedThiBot

const categories = [
  { id: 'premium',     name_en: '💎 Premium Choice (5A+)',    name_ru: '💎 Премиум Выбор (5A+)' },
  { id: 'bestvalue',   name_en: '💰 Best Value (4A)',         name_ru: '💰 Лучшая Цена (4A)' },
  { id: 'freshless',   name_en: '🌿 Fresh for Less',          name_ru: '🌿 Свежесть по Акции' },
  { id: 'organic',     name_en: '🌱 Premium Organic',         name_ru: '🌱 Премиум Органика' },
];

const products = [
  // ===== PREMIUM CHOICE (5A+) =====
  {
    id: 'p1', cat: 'premium',
    name_en: 'Trop Cherry 5A+', name_ru: 'Trop Cherry 5A+',
    grade: '5A+', type: 'Sativa 60%',
    price_gram: 95, price_8th: 250, price_quarter: 435, price_half: 800, price_ounce: 1465,
    effects: ['Focused', 'Euphoric', 'Energetic'],
    stock: 793,
    cat_label: 'BRO PRICE PREMIUM CHOICE',
    image: ''
  },
  {
    id: 'p2', cat: 'premium',
    name_en: 'Orange Cuntz 5A+', name_ru: 'Orange Cuntz 5A+',
    grade: '5A+', type: 'Sativa 70%',
    price_gram: 250, price_8th: 660, price_quarter: 1140, price_half: 2100, price_ounce: 3850,
    effects: ['Happy', 'Uplift', 'Euphoric'],
    stock: 364.9,
    cat_label: 'BRO PRICE PREMIUM CHOICE',
    image: ''
  },
  {
    id: 'p3', cat: 'premium',
    name_en: 'Cream Smoothie 5A+', name_ru: 'Cream Smoothie 5A+',
    grade: '5A+', type: 'Indica 60%',
    price_gram: 120, price_8th: 315, price_quarter: 550, price_half: 1010, price_ounce: 1850,
    effects: ['Creative', 'Euphoria', 'Relaxing'],
    stock: 252.8,
    cat_label: 'BRO PRICE PREMIUM CHOICE',
    image: ''
  },
  {
    id: 'p4', cat: 'premium',
    name_en: 'Super Boof 5A+', name_ru: 'Super Boof 5A+',
    grade: '5A+', type: 'Hybrid',
    price_gram: 240, price_8th: 630, price_quarter: 1095, price_half: 2020, price_ounce: 3700,
    effects: ['Giggly', 'Focused', 'Euphoric'],
    stock: 229.7,
    cat_label: 'BRO PRICE PREMIUM CHOICE',
    image: ''
  },
  {
    id: 'p5', cat: 'premium',
    name_en: 'Garlic Juice 5A+', name_ru: 'Garlic Juice 5A+',
    grade: '5A+', type: 'Indica 70%',
    price_gram: 240, price_8th: 630, price_quarter: 1095, price_half: 2020, price_ounce: 3700,
    effects: ['Relaxed', 'Tingly', 'Euphoric'],
    stock: 213.7,
    cat_label: 'BRO PRICE PREMIUM CHOICE',
    image: ''
  },
  {
    id: 'p6', cat: 'premium',
    name_en: 'Permanent Marker 5A+', name_ru: 'Permanent Marker 5A+',
    grade: '5A+', type: 'Indica',
    price_gram: 300, price_8th: 790, price_quarter: 1365, price_half: 2520, price_ounce: 4620,
    effects: ['Tingly', 'Relaxed', 'Euphoric'],
    stock: 117.2,
    cat_label: 'BRO PRICE PREMIUM CHOICE',
    image: ''
  },

  // ===== BEST VALUE (4A) =====
  {
    id: 'b1', cat: 'bestvalue',
    name_en: 'Imperium X 4A Pop', name_ru: 'Imperium X 4A Pop',
    grade: '4A', type: 'Sativa 60%',
    price_gram: 30, price_8th: 80, price_quarter: 140, price_half: 255, price_ounce: 465,
    effects: ['Body High', 'Euphoria', 'Happy', 'Tingly'],
    stock: 1037.9,
    cat_label: 'BRO PRICE BEST VALUE',
    image: ''
  },
  {
    id: 'b2', cat: 'bestvalue',
    name_en: 'Tropicana Cherry 4A Pop', name_ru: 'Tropicana Cherry 4A Pop',
    grade: '4A', type: 'Sativa 60%',
    price_gram: 28, price_8th: 75, price_quarter: 130, price_half: 240, price_ounce: 435,
    effects: ['Focused', 'Uplifted', 'Euphoric'],
    stock: 910.5,
    cat_label: 'BRO PRICE BEST VALUE',
    image: ''
  },
  {
    id: 'b3', cat: 'bestvalue',
    name_en: 'OG Kush 4A', name_ru: 'OG Kush 4A',
    grade: '4A', type: 'Sativa 55%',
    price_gram: 50, price_8th: 120, price_quarter: 205, price_half: 380, price_ounce: 695,
    effects: ['Hungry', 'Relaxed', 'Sleepy'],
    stock: 959,
    cat_label: 'BRO PRICE BEST VALUE',
    image: ''
  },
  {
    id: 'b4', cat: 'bestvalue',
    name_en: 'White Runtz 4A Pop', name_ru: 'White Runtz 4A Pop',
    grade: '4A', type: 'Hybrid',
    price_gram: 28, price_8th: 75, price_quarter: 130, price_half: 240, price_ounce: 435,
    effects: ['Tingly', 'Relaxed', 'Euphoric'],
    stock: 524,
    cat_label: 'BRO PRICE BEST VALUE',
    image: ''
  },
  {
    id: 'b5', cat: 'bestvalue',
    name_en: 'Gelato #33 4A', name_ru: 'Gelato #33 4A',
    grade: '4A', type: 'Hybrid',
    price_gram: 40, price_8th: 105, price_quarter: 185, price_half: 340, price_ounce: 620,
    effects: ['Relaxed', 'Aroused', 'Happy'],
    stock: 597.2,
    cat_label: 'BRO PRICE BEST VALUE',
    image: ''
  },
  {
    id: 'b6', cat: 'bestvalue',
    name_en: 'Diamond OG 4A', name_ru: 'Diamond OG 4A',
    grade: '4A', type: 'Indica',
    price_gram: 20, price_8th: 55, price_quarter: 95, price_half: 170, price_ounce: 310,
    effects: ['Body High', 'Calming', 'Happy'],
    stock: 103,
    cat_label: 'BRO PRICE BEST VALUE',
    image: ''
  },
  {
    id: 'b7', cat: 'bestvalue',
    name_en: 'Thin Mint 4A', name_ru: 'Thin Mint 4A',
    grade: '4A', type: 'Hybrid',
    price_gram: 40, price_8th: 105, price_quarter: 185, price_half: 340, price_ounce: 620,
    effects: ['Relaxed', 'Tingly', 'Euphoric'],
    stock: 414.8,
    cat_label: 'BRO PRICE BEST VALUE',
    image: ''
  },

  // ===== FRESH FOR LESS =====
  {
    id: 'f1', cat: 'freshless',
    name_en: 'Zoap 5A+', name_ru: 'Zoap 5A+',
    grade: '5A+', type: 'Hybrid',
    price_gram: 80, price_8th: 210, price_quarter: 365, price_half: 675, price_ounce: 1235,
    effects: ['Giggly', 'Relaxed', 'Happy'],
    stock: 176.8,
    cat_label: 'FRESH FOR LESS',
    image: ''
  },
  {
    id: 'f2', cat: 'freshless',
    name_en: 'Baby Lobster 5A', name_ru: 'Baby Lobster 5A',
    grade: '5A', type: 'Indica',
    price_gram: 90, price_8th: 240, price_quarter: 410, price_half: 760, price_ounce: 1390,
    effects: ['Euphoric', 'Relaxed', 'Talkative'],
    stock: 176,
    cat_label: 'FRESH FOR LESS',
    image: ''
  },
  {
    id: 'f3', cat: 'freshless',
    name_en: 'Gas Fruit 5A+', name_ru: 'Gas Fruit 5A+',
    grade: '5A+', type: 'Hybrid',
    price_gram: 90, price_8th: 240, price_quarter: 410, price_half: 760, price_ounce: 1390,
    effects: ['Calming', 'Focus', 'Relaxing'],
    stock: 148.3,
    cat_label: 'FRESH FOR LESS',
    image: ''
  },
  {
    id: 'f4', cat: 'freshless',
    name_en: 'Louis XIII 5A+', name_ru: 'Louis XIII 5A+',
    grade: '5A+', type: 'Indica',
    price_gram: 110, price_8th: 290, price_quarter: 505, price_half: 925, price_ounce: 1695,
    effects: ['Euphoria', 'Happy', 'Relaxing'],
    stock: 142.1,
    cat_label: 'FRESH FOR LESS',
    image: ''
  },
  {
    id: 'f5', cat: 'freshless',
    name_en: '007 5A+', name_ru: '007 5A+',
    grade: '5A+', type: 'Indica',
    price_gram: 80, price_8th: 210, price_quarter: 365, price_half: 675, price_ounce: 1235,
    effects: ['Calming', 'Creative', 'Happy', 'Relaxing'],
    stock: 119.6,
    cat_label: 'FRESH FOR LESS',
    image: ''
  },

  // ===== PREMIUM ORGANIC =====
  {
    id: 'o1', cat: 'organic',
    name_en: 'Oishii 5A+ (Organic)', name_ru: 'Oishii 5A+ (Organic)',
    grade: '5A+', type: 'Hybrid',
    price_gram: 140, price_8th: 370, price_quarter: 640, price_half: 1180, price_ounce: 2160,
    effects: ['Relaxed', 'Euphoric', 'Tingly'],
    stock: 174.5,
    cat_label: 'PREMIUM ORGANIC',
    image: ''
  },
  {
    id: 'o2', cat: 'organic',
    name_en: 'Mac Daddy 5A+ (Organic)', name_ru: 'Mac Daddy 5A+ (Organic)',
    grade: '5A+', type: 'Indica',
    price_gram: 150, price_8th: 395, price_quarter: 685, price_half: 1260, price_ounce: 2310,
    effects: ['Aroused', 'Euphoric', 'Relaxed'],
    stock: 157.9,
    cat_label: 'PREMIUM ORGANIC',
    image: ''
  },
  {
    id: 'o3', cat: 'organic',
    name_en: 'World Peace 5A+ (Organic)', name_ru: 'World Peace 5A+ (Organic)',
    grade: '5A+', type: 'Indica',
    price_gram: 150, price_8th: 395, price_quarter: 685, price_half: 1260, price_ounce: 2310,
    effects: ['Relaxed', 'Happy', 'Calm'],
    stock: 133.9,
    cat_label: 'PREMIUM ORGANIC',
    image: ''
  },
];

module.exports = { categories, products };
