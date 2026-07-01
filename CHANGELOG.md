# 🌿 Parvati Weed Bot — Changelog

All notable changes to this project will be documented in this file.

## [v3.1] — 2026-07-01
### Added
- 🖼 **Premium AI-generated product photos** (welcome screen)
- 📸 **Photo support in bot** — welcome message with cannabis image
- 📊 **Google Sheets integration** — 11 products exported to Spar City Products sheet
- 🔄 **Keep-alive script** — auto-restart on crash
- 🗑️ **Legacy files cleaned** — removed bot_v2.js, bot_v3.js

### Changed
- 🔄 **Full rewrite** — clean bot_clean.js (only weed + kratom)
- 🧭 **Simplified navigation**: Menu → Category → Product → Cart → Order
- 🏪 **21 premium strains** in 4 categories (Premium Choice 5A+, Best Value 4A, Fresh for Less, Premium Organic)
- 💰 **Prices from source**: Joint / 1g / 3.5g / 7g / 14g / 28g
- 🌍 **Bilingual**: English + Русский
- 🛒 **Cart with inline controls** ➕➖🗑️
- 💳 **3 payment methods**: PromptPay QR / Cash / Crypto (USDT/BTC)
- 📍 **4 delivery zones**: Bangkok, Phuket, Samui, Phangan
- ❓ **FAQ section**

### Fixed
- 🐛 All known bugs from v2.x (navigation hang, price errors)

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