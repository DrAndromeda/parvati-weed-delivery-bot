// 🌿 Parvati Weed — Spar City Premium Strains
// Sourced from choochoohemp.com API — all 21 curated products
// Prices match website: Joint / 1g / 3.5g / 7g / 14g / 28g

const categories = [
  { id: 'premium',   name_en: '💎 Premium Choice (5A+)',  name_ru: '💎 Премиум Выбор (5A+)' },
  { id: 'bestvalue', name_en: '💰 Best Value (4A)',        name_ru: '💰 Лучшая Цена (4A)' },
  { id: 'freshless', name_en: '🌿 Fresh for Less',          name_ru: '🌿 Свежесть по Акции' },
  { id: 'organic',   name_en: '🌱 Premium Organic',         name_ru: '🌱 Премиум Органика' },
];

const products = [
  // ───────────── PREMIUM CHOICE 5A+ ─────────────
  {
    id: 'p1', cat: 'premium',
    name_en: '🍒 Trop Cherry 5A+', name_ru: '🍒 Trop Cherry 5A+',
    grade: '5A+', type: 'Sativa 60%',
    description_en: 'Premium Sativa with focused, euphoric effects. Bursting with cherry and citrus terpenes — a true connoisseur choice.',
    description_ru: 'Премиум Сатива с фокусирующим, эйфорическим эффектом. Взрыв вишнёвых и цитрусовых терпенов.',
    price_joint: 95, price_gram: 95, price_8th: 250, price_quarter: 435, price_half: 800, price_ounce: 1465,
    effects: ['Focused', 'Euphoric', 'Energetic'], stock: 793,
    cat_label: 'BRO PRICE PREMIUM CHOICE', image: ''
  },
  {
    id: 'p2', cat: 'premium',
    name_en: '🍊 Orange Cuntz 5A+', name_ru: '🍊 Orange Cuntz 5A+',
    grade: '5A+', type: 'Sativa 70%',
    description_en: 'Ultra-premium Sativa with a sweet citrus profile. Happy, uplifting effects perfect for daytime.',
    description_ru: 'Ультра-премиум Сатива со сладким цитрусовым профилем. Счастливый, поднимающий настроение эффект.',
    price_joint: 250, price_gram: 250, price_8th: 660, price_quarter: 1140, price_half: 2100, price_ounce: 3850,
    effects: ['Happy', 'Uplift', 'Euphoric'], stock: 364.9,
    cat_label: 'BRO PRICE PREMIUM CHOICE', image: ''
  },
  {
    id: 'p3', cat: 'premium',
    name_en: '🥤 Cream Smoothie 5A+', name_ru: '🥤 Cream Smoothie 5A+',
    grade: '5A+', type: 'Indica 60%',
    description_en: 'Smooth and creamy Indica with creative, euphoric vibes. Perfect for evening relaxation.',
    description_ru: 'Мягкая Индика с креативным, эйфорическим настроением. Идеальна для вечернего отдыха.',
    price_joint: 120, price_gram: 120, price_8th: 315, price_quarter: 550, price_half: 1010, price_ounce: 1850,
    effects: ['Creative', 'Euphoria', 'Relaxing'], stock: 252.8,
    cat_label: 'BRO PRICE PREMIUM CHOICE', image: ''
  },
  {
    id: 'p4', cat: 'premium',
    name_en: '🦍 Super Boof 5A+', name_ru: '🦍 Super Boof 5A+',
    grade: '5A+', type: 'Hybrid',
    description_en: 'Award-winning Hybrid. Giggly, focused, and euphoric — the perfect social smoke.',
    description_ru: 'Наградной Гибрид. Весёлый, фокусирующий и эйфорический — идеальный для компании.',
    price_joint: 240, price_gram: 240, price_8th: 630, price_quarter: 1095, price_half: 2020, price_ounce: 3700,
    effects: ['Giggly', 'Focused', 'Euphoric'], stock: 229.7,
    cat_label: 'BRO PRICE PREMIUM CHOICE', image: ''
  },
  {
    id: 'p5', cat: 'premium',
    name_en: '🧄 Garlic Juice 5A+', name_ru: '🧄 Garlic Juice 5A+',
    grade: '5A+', type: 'Indica 70%',
    description_en: 'Heavy Indica with relaxing, tingly effects. Earthy garlic & diesel terps.',
    description_ru: 'Тяжёлая Индика с расслабляющим, покалывающим эффектом. Землистые ноты чеснока и дизеля.',
    price_joint: 240, price_gram: 240, price_8th: 630, price_quarter: 1095, price_half: 2020, price_ounce: 3700,
    effects: ['Relaxed', 'Tingly', 'Euphoric'], stock: 213.7,
    cat_label: 'BRO PRICE PREMIUM CHOICE', image: ''
  },
  {
    id: 'p6', cat: 'premium',
    name_en: '🖊️ Permanent Marker 5A+', name_ru: '🖊️ Permanent Marker 5A+',
    grade: '5A+', type: 'Indica',
    description_en: 'Bold Indica with tingly, relaxing body high. Sharp diesel aroma.',
    description_ru: 'Яркая Индика с покалывающим, расслабляющим телесным эффектом. Резкий дизельный аромат.',
    price_joint: 300, price_gram: 300, price_8th: 790, price_quarter: 1365, price_half: 2520, price_ounce: 4620,
    effects: ['Tingly', 'Relaxed', 'Euphoric'], stock: 117.2,
    cat_label: 'BRO PRICE PREMIUM CHOICE', image: ''
  },
  {
    id: 'p7', cat: 'premium',
    name_en: '🌈 Rainbow Chip 5A+', name_ru: '🌈 Rainbow Chip 5A+',
    grade: '5A+', type: 'Hybrid',
    description_en: 'Uplifted and energetic Hybrid with sweet candy terps. Great for creative sessions.',
    description_ru: 'Поднимающий настроение Гибрид со сладкими конфетными терпенами. Отлично для творчества.',
    price_joint: 120, price_gram: 120, price_8th: 315, price_quarter: 550, price_half: 1010, price_ounce: 1850,
    effects: ['Uplifted', 'Energetic', 'Giggly'], stock: 143.4,
    cat_label: 'BRO PRICE PREMIUM CHOICE', image: ''
  },

  // ───────────── BEST VALUE 4A ─────────────
  {
    id: 'b1', cat: 'bestvalue',
    name_en: '👑 Imperium X 4A Pop', name_ru: '👑 Imperium X 4A Поп',
    grade: '4A', type: 'Sativa 60%',
    description_en: 'Best value Sativa Pop. Body high, euphoria, and happiness — great all-rounder.',
    description_ru: 'Лучшая по цене Сатива Поп. Телесный кайф, эйфория и счастье — отличный универсал.',
    price_joint: 30, price_gram: 30, price_8th: 80, price_quarter: 140, price_half: 255, price_ounce: 465,
    effects: ['Body High', 'Euphoria', 'Happy'], stock: 1037.9,
    cat_label: 'BRO PRICE BEST VALUE', image: ''
  },
  {
    id: 'b2', cat: 'bestvalue',
    name_en: '🍒 Tropicana Cherry 4A Pop', name_ru: '🍒 Tropicana Cherry 4A Поп',
    grade: '4A', type: 'Sativa 60%',
    description_en: 'Fruit-forward Sativa Pop. Focused, uplifted, and euphoric. Incredible value!',
    description_ru: 'Фруктовая Сатива Поп. Фокус, подъём настроения, эйфория. Невероятная цена!',
    price_joint: 28, price_gram: 28, price_8th: 75, price_quarter: 130, price_half: 240, price_ounce: 435,
    effects: ['Focused', 'Uplifted', 'Euphoric'], stock: 910.5,
    cat_label: 'BRO PRICE BEST VALUE', image: ''
  },
  {
    id: 'b3', cat: 'bestvalue',
    name_en: '🌿 OG Kush 4A', name_ru: '🌿 OG Kush 4A',
    grade: '4A', type: 'Sativa 55%',
    description_en: 'Legendary OG Kush. Relaxed, hungry, sleepy — the classic experience.',
    description_ru: 'Легендарный OG Kush. Расслабленный, голодный, сонный — классический опыт.',
    price_joint: 45, price_gram: 50, price_8th: 120, price_quarter: 205, price_half: 380, price_ounce: 695,
    effects: ['Hungry', 'Relaxed', 'Sleepy'], stock: 959,
    cat_label: 'BRO PRICE BEST VALUE', image: ''
  },
  {
    id: 'b4', cat: 'bestvalue',
    name_en: '🤍 White Runtz 4A Pop', name_ru: '🤍 White Runtz 4A Поп',
    grade: '4A', type: 'Hybrid',
    description_en: 'Sweet and creamy Hybrid. Tingly, relaxed, euphoric — a crowd favorite.',
    description_ru: 'Сладкий и сливочный Гибрид. Покалывающий, расслабляющий, эйфорический.',
    price_joint: 28, price_gram: 28, price_8th: 75, price_quarter: 130, price_half: 240, price_ounce: 435,
    effects: ['Tingly', 'Relaxed', 'Euphoric'], stock: 524,
    cat_label: 'BRO PRICE BEST VALUE', image: ''
  },
  {
    id: 'b5', cat: 'bestvalue',
    name_en: '🍨 Gelato #33 4A', name_ru: '🍨 Gelato #33 4A',
    grade: '4A', type: 'Hybrid',
    description_en: 'Premium Gelato cut. Relaxed, aroused, happy — dessert terps galore.',
    description_ru: 'Премиум сорт Gelato. Расслабленный, возбуждённый, счастливый — десертные терпены.',
    price_joint: 40, price_gram: 40, price_8th: 105, price_quarter: 185, price_half: 340, price_ounce: 620,
    effects: ['Relaxed', 'Aroused', 'Happy'], stock: 597.2,
    cat_label: 'BRO PRICE BEST VALUE', image: ''
  },
  {
    id: 'b6', cat: 'bestvalue',
    name_en: '💎 Diamond OG 4A', name_ru: '💎 Diamond OG 4A',
    grade: '4A', type: 'Indica',
    description_en: 'Body-calming Indica at an unbeatable price. Happy, calm, body high.',
    description_ru: 'Телесно-успокаивающая Индика по unbeatable цене. Счастливый, спокойный, телесный.',
    price_joint: 20, price_gram: 20, price_8th: 55, price_quarter: 95, price_half: 170, price_ounce: 310,
    effects: ['Body High', 'Calming', 'Happy'], stock: 103,
    cat_label: 'BRO PRICE BEST VALUE', image: ''
  },

  // ───────────── FRESH FOR LESS ─────────────
  {
    id: 'f1', cat: 'freshless',
    name_en: '🧁 Zoap 5A+', name_ru: '🧁 Zoap 5A+',
    grade: '5A+', type: 'Hybrid',
    description_en: 'Super fresh Hybrid. Giggly, relaxed, happy — sweet soapy terps.',
    description_ru: 'Супер-свежий Гибрид. Весёлый, расслабленный, счастливый — сладкие мыльные терпены.',
    price_joint: 80, price_gram: 80, price_8th: 210, price_quarter: 365, price_half: 675, price_ounce: 1235,
    effects: ['Giggly', 'Relaxed', 'Happy'], stock: 176.8,
    cat_label: 'FRESH FOR LESS', image: ''
  },
  {
    id: 'f2', cat: 'freshless',
    name_en: '🦞 Baby Lobster 5A', name_ru: '🦞 Baby Lobster 5A',
    grade: '5A', type: 'Indica',
    description_en: 'Rare Indica. Euphoric, relaxed, talkative — unique seafood terp profile.',
    description_ru: 'Редкая Индика. Эйфорическая, расслабленная, разговорчивая — уникальный профиль.',
    price_joint: 90, price_gram: 90, price_8th: 240, price_quarter: 410, price_half: 760, price_ounce: 1390,
    effects: ['Euphoric', 'Relaxed', 'Talkative'], stock: 176,
    cat_label: 'FRESH FOR LESS', image: ''
  },
  {
    id: 'f3', cat: 'freshless',
    name_en: '⛽ Gas Fruit 5A+', name_ru: '⛽ Gas Fruit 5A+',
    grade: '5A+', type: 'Hybrid',
    description_en: 'Calming yet focused Hybrid. Perfect balance of gas and fruit.',
    description_ru: 'Успокаивающий, но фокусирующий Гибрид. Идеальный баланс газа и фруктов.',
    price_joint: 90, price_gram: 90, price_8th: 240, price_quarter: 410, price_half: 760, price_ounce: 1390,
    effects: ['Calming', 'Focus', 'Relaxing'], stock: 148.3,
    cat_label: 'FRESH FOR LESS', image: ''
  },
  {
    id: 'f4', cat: 'freshless',
    name_en: '👑 Louis XIII 5A+', name_ru: '👑 Louis XIII 5A+',
    grade: '5A+', type: 'Indica',
    description_en: 'Royal Indica. Euphoric, happy, relaxing — cognac-inspired terps.',
    description_ru: 'Королевская Индика. Эйфорическая, счастливая, расслабляющая — терпены в стиле коньяка.',
    price_joint: 110, price_gram: 110, price_8th: 290, price_quarter: 505, price_half: 925, price_ounce: 1695,
    effects: ['Euphoria', 'Happy', 'Relaxing'], stock: 142.1,
    cat_label: 'FRESH FOR LESS', image: ''
  },
  {
    id: 'f5', cat: 'freshless',
    name_en: '🕵️ 007 5A+', name_ru: '🕵️ 007 5A+',
    grade: '5A+', type: 'Indica',
    description_en: 'Classy Indica. Calming, creative, giggly — smooth as a martini.',
    description_ru: 'Классная Индика. Успокаивающая, креативная, весёлая — гладкая как мартини.',
    price_joint: 80, price_gram: 80, price_8th: 210, price_quarter: 365, price_half: 675, price_ounce: 1235,
    effects: ['Calming', 'Creative', 'Happy', 'Relaxing'], stock: 119.6,
    cat_label: 'FRESH FOR LESS', image: ''
  },

  // ───────────── PREMIUM ORGANIC ─────────────
  {
    id: 'o1', cat: 'organic',
    name_en: '🍱 Oishii 5A+ Organic', name_ru: '🍱 Oishii 5A+ Organic',
    grade: '5A+', type: 'Hybrid',
    description_en: 'Organic Hybrid. Relaxed, euphoric, tingly — clean organic grow.',
    description_ru: 'Органический Гибрид. Расслабленный, эйфорический, покалывающий — чистый органический рост.',
    price_joint: 140, price_gram: 140, price_8th: 370, price_quarter: 640, price_half: 1180, price_ounce: 2160,
    effects: ['Relaxed', 'Euphoric', 'Tingly'], stock: 174.5,
    cat_label: 'PREMIUM ORGANIC', image: ''
  },
  {
    id: 'o2', cat: 'organic',
    name_en: '🧔 Mac Daddy 5A+ Organic', name_ru: '🧔 Mac Daddy 5A+ Organic',
    grade: '5A+', type: 'Indica',
    description_en: 'Organic Indica. Aroused, euphoric, relaxed — Daddy\'s special.',
    description_ru: 'Органическая Индика. Возбуждённая, эйфорическая, расслабленная — папин особенный.',
    price_joint: 150, price_gram: 150, price_8th: 395, price_quarter: 685, price_half: 1260, price_ounce: 2310,
    effects: ['Aroused', 'Euphoric', 'Relaxed'], stock: 157.9,
    cat_label: 'PREMIUM ORGANIC', image: ''
  },
  {
    id: 'o3', cat: 'organic',
    name_en: '☮️ World Peace 5A+ Organic', name_ru: '☮️ World Peace 5A+ Organic',
    grade: '5A+', type: 'Indica',
    description_en: 'Ultimate organic Indica for deep relaxation. Calm, happy, at peace.',
    description_ru: 'Высшая органическая Индика для глубокого расслабления. Спокойствие, счастье, мир.',
    price_joint: 150, price_gram: 150, price_8th: 395, price_quarter: 685, price_half: 1260, price_ounce: 2310,
    effects: ['Relaxed', 'Happy', 'Calm'], stock: 133.9,
    cat_label: 'PREMIUM ORGANIC', image: ''
  },
  {
    id: 'o4', cat: 'organic',
    name_en: '🍈 Melon Nishi 5A+ Organic', name_ru: '🍈 Melon Nishi 5A+ Organic',
    grade: '5A+', type: 'Hybrid',
    description_en: 'Organic Hybrid with melon terps. Relaxing, creative, euphoric.',
    description_ru: 'Органический Гибрид с дынными терпенами. Расслабляющий, креативный, эйфорический.',
    price_joint: 150, price_gram: 150, price_8th: 395, price_quarter: 685, price_half: 1260, price_ounce: 2310,
    effects: ['Relaxation', 'Creative', 'Euphoria'], stock: 160,
    cat_label: 'PREMIUM ORGANIC', image: ''
  },
];

module.exports = { categories, products };