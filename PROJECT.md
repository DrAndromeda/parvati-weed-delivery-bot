# 🌿 Parvati Weed Bot — Project Tasks & Roadmap

**Repository:** https://github.com/DrAndromeda/parvati-weed-delivery-bot  
**Live Bot:** @Parvati_WeedThiBot  
**Project Manager:** @karmadharma_bot  
**Developer:** @karma_chakra_bot  
**Client/QA:** Kim (@dr_Andromeda)

---

## 🚀 PHASE 1: Foundation ✅ (Done)

| Task | Status | Owner |
|------|--------|-------|
| Парсинг товаров с choochoohemp.com | ✅ Done | @karmadharma_bot |
| Создание репозитория на GitHub | ✅ Done | @karmadharma_bot |
| Базовая структура бота (категории, товары) | ✅ Done | @karmadharma_bot |
| Премиум карточки товаров с эмодзи | ✅ Done | @karmadharma_bot |
| Корзина с инлайн-контролами (+/-/удалить) | ✅ Done | @karmadharma_bot |
| 3 способа оплаты (QR / Наличные / Крипта) | ✅ Done | @karmadharma_bot |
| Выбор размера (1g / 3.5g / 7g / 14g / 28g) | ✅ Done | @karmadharma_bot |
| FAQ секция | ✅ Done | @karmadharma_bot |
| Тесты (488 проверок, все пройдены) | ✅ Done | @karmadharma_bot |
| Бот запущен на сервере | ✅ Done | @karmadharma_bot |

---

## 🎯 PHASE 2: Premium Design Polish (Current)

| # | Task | Status | Owner | Deadline |
|---|------|--------|-------|----------|
| 2.1 | **Welcome-сообщение** — премиум текст, логотип | 📝 In Progress | @karmadharma_bot | EOD Jul 1 |
| 2.2 | **Картинки товаров** — AI-генерация или сток | ⏳ Todo | @karma_chakra_bot | Jul 3 |
| 2.3 | **Категорийные штампы** (Premium Choice / Best Value иконки) | 📝 In Progress | @karmadharma_bot | Jul 2 |
| 2.4 | **Фирменный стиль** — цвета, шрифты, тональность | ⏳ Todo | @karma_chakra_bot | Jul 3 |
| 2.5 | **Полноэкранное меню** — редизайн кнопок (не узкое) | ⏳ Todo | @karma_chakra_bot | Jul 2 |
| 2.6 | **Эмодзи-оформление** всех описаний товаров | ✅ Done | @karmadharma_bot | — |
| 2.7 | **Градация цен** — вынести Joint/Gram/3.5/7/14/28g | ✅ Done | @karmadharma_bot | — |

---

## 🛒 PHASE 3: Shopping Experience

| # | Task | Status | Owner | Deadline |
|---|------|--------|-------|----------|
| 3.1 | **Путь клиента** — пройти весь флоу, исправить баги | ⏳ Todo | @karma_chakra_bot | Jul 3 |
| 3.2 | **Ошибка градации цен** — зависает на выборе сорта | 🐛 Bug | @karma_chakra_bot | ASAP |
| 3.3 | **Подтверждение заказа** — работает? протестировать | ⏳ Todo | @karma_chakra_bot | Jul 3 |
| 3.4 | **Уведомление админу** — формат, читаемость | ⏳ Todo | @karma_chakra_bot | Jul 4 |
| 3.5 | **Сохранение истории заказов** (в БД) | ⏳ Todo | @karma_chakra_bot | Jul 5 |

---

## 💳 PHASE 4: Payments

| # | Task | Status | Owner | Deadline |
|---|------|--------|-------|----------|
| 4.1 | **PromptPay QR** — интеграция статического/динамического QR | ⏳ Todo | @karma_chakra_bot | Jul 6 |
| 4.2 | **Крипта (USDT/BTC)** — API NOWPayments или Coinbase | ⏳ Todo | @karma_chakra_bot | Jul 7 |
| 4.3 | **Наличные курьеру** — поток работает | ✅ Done | @karmadharma_bot | — |

---

## 🧪 PHASE 5: Testing & QA

| # | Task | Status | Owner | Deadline |
|---|------|--------|-------|----------|
| 5.1 | **Юнит-тесты** — 488 проверок | ✅ Done | @karmadharma_bot | — |
| 5.2 | **E2E тестирование** — пройти весь путь клиента | ⏳ Todo | @karma_chakra_bot | Jul 4 |
| 5.3 | **Нагрузочное тестирование** | ⏳ Todo | @karma_chakra_bot | Jul 5 |
| 5.4 | **Баг-репорт** — найти и исправить все падения | ⏳ Todo | @karma_chakra_bot | Jul 4 |

---

## 📦 PHASE 6: Content & Expansion

| # | Task | Status | Owner | Deadline |
|---|------|--------|-------|----------|
| 6.1 | **Все 109 товаров** — добавить полный ассортимент | ⏳ Todo | @karma_chakra_bot | Jul 8 |
| 6.2 | **Kief/Edibles/Pre-rolls** — добавить если появятся на сайте | ⏳ Todo | @karma_chakra_bot | TBD |
| 6.3 | **Тайский язык** — добавить третий язык | ⏳ Todo | @karma_chakra_bot | Jul 10 |
| 6.4 | **Реферальная система** — скидки за приведённых друзей | ⏳ Todo | @karma_chakra_bot | Jul 12 |

---

## 🔧 How to Contribute

1. Форкните репозиторий или запросите collaborator доступ
2. Сделайте изменения в своей ветке
3. Откройте Pull Request
4. @karmadharma_bot проверяет и мержит

**Запуск локально:**
```bash
git clone https://github.com/DrAndromeda/parvati-weed-delivery-bot
cd parvati-weed-delivery-bot
npm install
BOT_TOKEN=your_token ADMIN_ID=237228075 node bot_v3.js
```

**Запуск тестов:**
```bash
node tests.js
```

---

*Last updated: 2026-07-01 18:09 ICT*  
*Project Manager: @karmadharma_bot*  
*Developer: @karma_chakra_bot*