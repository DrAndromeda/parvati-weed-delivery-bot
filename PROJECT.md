# 📋 Parvati 420 — Project Overview

## 🎯 Purpose
Telegram bot for premium herbal delivery in Thailand.
Rebranded from "Parvati Weed" to "Parvati 420" to avoid Telegram ToS blocks.

---

## 🤖 Bot Info

| Field | Value |
|-------|-------|
| **Active bot** | @Growclub_bot |
| **Token** | `8990540112:AAGCrX56CgbsDind9zi6qfnfyxjdbxvBm-w` |
| **GitHub** | [DrAndromeda/parvati-weed-delivery-bot](https://github.com/DrAndromeda/parvati-weed-delivery-bot) |
| **Admin ID** | `237228075` (Kim / @dr_Andromeda) |
| **Platform** | Node.js + Telegraf |
| **Version** | v4.0 |

> ⚠️ **Token security:** Never post tokens in group chats. Only share via DM.

---

## 🧠 Architecture

```
start_bot.js         ← Sets BOT_TOKEN env, requires bot.js
    ↓
bot.js               ← Main logic (Telegraf handlers, cart, payments)
    ↓
products.js          ← Product catalog, size groups, helpers
```

**No persistent storage** — uses in-memory `userState` object.
All conversations reset on restart.

---

## 🛍️ Features

### Products
- 5 categories: Kratom, Flower, Edibles, Pre-rolls, Accessories
- **Size groups** for flower strains (1g/3g/5g) — group variants into one menu entry
- Each product has: name_en, name_ru, desc_en, desc_ru, price, cat, id, size, effects, thc

### Cart
- In-memory per-chat cart
- Add from inline buttons, view from static menu
- Clear cart button
- Cart is lost on bot restart

### Delivery Zones
| Zone | Price (THB) |
|------|-------:|
| Bangkok | 100 |
| Phuket | 500 |
| Samui | 600 |
| Pangyan | 700 |

### Payment
| Method | How it works |
|--------|-------------|
| 💳 PromptPay QR | Generates QR via `https://promptpay.io/{phone}/{amount}.png` |
| 💵 Cash on delivery | Pay courier |
| ₿ Crypto (USDT/BTC) | Show wallet addresses |

### Language
- English / Russian — selected at `/start`
- Remembered per-chat

### Static Keyboard
Always visible at the bottom:
```
🛍️ Shop  |  🛒 Cart
🌍 Language  |  ❓ Help
```

---

## 🚀 Deployment

### Local
```bash
cd parvati-weed-delivery-bot
npm install
echo "BOT_TOKEN=8990540112:AAGCrX56CgbsDind9zi6qfnfyxjdbxvBm-w" > .env
echo "ADMIN_ID=237228075" >> .env
node bot.js
```

### Production (with pm2)
```bash
npm install -g pm2
BOT_TOKEN=... ADMIN_ID=237228075 pm2 start bot.js --name parvati420
pm2 save
```

### Using start_bot.js
```bash
node start_bot.js
```
(Embedded token — for development only, don't commit to git)

---

## 🔧 Config (in bot.js)

```js
const PROMPTPAY_PHONE = '0812345678';   // ← Replace with real
const USDT_ADDRESS = '0x1234...';       // ← Replace with real
const BTC_ADDRESS = 'bc1qxyz...';       // ← Replace with real
```

---

## 🧪 Testing

```bash
npm test          # Runs 377 tests
```

Tests cover:
- Product structure
- Category integrity
- Size variants
- Helper functions

---

## 🐛 Known Issues & Fixes

### ❌ "Cannot access 'pName' before initialization"
**Cause:** Temporal Dead Zone in old products.js — using variable before `const` declaration.
**Fix:** v4.0 doesn't use `pName`. Ensure latest code is deployed.

### ❌ "reply_markup is not defined"
**Cause:** Calling inline button methods in text handler without passing `Markup`.
**Fix:** v4.0 uses `Markup.keyboard(...)` for static menu and `Markup.button.callback(...)` for inline.

### ❌ "sendPhoto socket hang up"
**Cause:** QR code URL not reachable or timeout.
**Fix:** v4.0 has fallback — sends QR link as text if photo fails.

### ❌ "409: Conflict"
**Cause:** Multiple bot instances with same token.
**Fix:** Kill old process: `pkill -f "bot.js"`, then start fresh.

### ❌ "403: Bot was blocked by user"
**Cause:** User blocked the bot.
**Fix:** Can't do anything — remove user from broadcast lists.

### ❌ "chat not found"
**Cause:** Bot can't initiate DM to user.
**Fix:** User must `/start` the bot first. Then bot can reply.

---

## 📜 History (Changelog)

| Version | Date | Key Changes |
|---------|------|-------------|
| v4.0 | 2026-07-01 | Static reply keyboard, size groups, PromptPay QR, 377 tests |
| v3.1 | 2026-07-01 | Premium photos, Google Sheets, keep-alive (deprecated) |
| v2.0 | 2026-07-01 | Full rewrite: 21 strains, bilingual, cart, payments |
| v1.0 | Pre-July | Original by @karma_chakra_bot |

---

## 👥 Team

| Role | Person | Handle |
|------|--------|--------|
| **Owner** | Kim | @dr_Andromeda |
| **Developer** | Karma (main) | @karmadharma_bot |
| **Developer** | Karma Chakra | @karma_chakra_bot |

---

## 🔜 Roadmap

- [ ] **Real PromptPay number** — replace placeholder
- [ ] **Real USDT/BTC addresses** — replace placeholders
- [ ] **Product images** — add to welcome screen
- [ ] **Persistent storage** — SQLite or PostgreSQL
- [ ] **Promo codes**
- [ ] **Thai language**
- [ ] **Testimonials / reviews**
- [ ] **Production deploy** (pm2 or VPS)
- [ ] **Admin panel** — web dashboard
