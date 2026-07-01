# 🌿 Parvati Weed Bot — Changelog

All notable changes to this project will be documented in this file.

## [v4.0] — 2026-07-01
### Added
- ☑️ **Static reply keyboard** — меню всегда внизу (Shop/Cart/Language/Help)
- 🗂️ **Size variant grouping** — выбор 1г/3г/5г при добавлении flower strains
- 💳 **PromptPay QR** — генерация QR через promptpay.io
- 💵 **Cash to courier** — оплата при получении
- ₿ **Crypto (USDT/BTC)** — адреса кошельков
- 📍 **4 delivery zones**: Bangkok (100), Phuket (500), Samui (600), Pangyan (700)
- 🧪 **377 unit tests** — все пройдены
- 🧹 **Legacy cleanup** — удалены дубли bot_*.js, products_*.js

### Changed
- 🔄 **Unified codebase**: один bot.js, один products.js
- 🏷️ **Rebrand to Parvati 420** — нейтральное имя, без weed/cannabis
- 🖼️ **Premium product descriptions** — эффекты, вкусы, THC%
- 🐛 `Cannot access 'pName' before initialization` — исправлен
- 🐛 `reply_markup is not defined` — исправлен

## [v3.1] — 2026-07-01 (deprecated)

## [v2.0] — 2026-07-01
### Added
- First premium version with Spar City strains
- products_spar_city.js — 21 products
- Cart with inline controls
- 3 payment methods
- Delivery zones
- FAQ
- 488 tests

## [v1.0] — Pre-2026-07-01
- Original bot_simple.js by @karma_chakra_bot
- Telegraf-based, single menu
- Basic cart and order flow