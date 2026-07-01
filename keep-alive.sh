#!/bin/bash
# Auto-restart for Parvati bot
cd /tmp/parvati-current
export BOT_TOKEN="8284820278:AAGibaELwGgE_lfB0H1yZgUSn32dxqHuXaQ"
export ADMIN_ID="237228075"
while true; do
  node bot_clean.js >> /tmp/parvati-bot.log 2>&1
  sleep 3
done