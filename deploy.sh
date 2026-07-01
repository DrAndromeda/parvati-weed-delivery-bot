#!/bin/bash
# Deploy Parvati Weed Thailand Bot — v2.2
# Usage: bash deploy.sh
set -e

echo "🚀 Parvati Weed Thailand Bot - Deploy Script"
echo "============================================"

# 1. Check dependencies
echo "📦 Installing dependencies..."
npm install telegraf qrcode

# 2. Create .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'ENVEOF'
BOT_TOKEN=your_telegram_bot_token_here
ADMIN_ID=237228075
ENVEOF
    echo "⚠️  Edit .env and set your BOT_TOKEN!"
fi

# 3. Validate code
echo "✅ Validating code..."
node -c bot.js
node -c products.js

# 4. Run tests
echo "🧪 Running tests..."
node test.js

# 5. Start bot
echo "🤖 Starting bot..."
echo "Logs: bot.log"
node bot.js > bot.log 2>&1 &
BOT_PID=$!
echo $BOT_PID > bot.pid
echo "Bot started (PID: $BOT_PID)"
echo ""
echo "📌 Commands:"
echo "  View logs: tail -f bot.log"
echo "  Stop: kill \$(cat bot.pid)"
echo "  Restart: kill \$(cat bot.pid) && node bot.js > bot.log 2>&1 &"

# 6. PM2 support (if available)
if command -v pm2 &> /dev/null; then
    echo ""
    echo "🔄 PM2 detected — use pm2 for production:"
    echo "  pm2 start bot.js --name parvati-bot"
fi