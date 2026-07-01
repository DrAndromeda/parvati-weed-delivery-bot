#!/bin/bash
cd /tmp/parvati-current
export BOT_TOKEN="8284820278:AAGibaELwGgE_lfB0H1yZgUSn32dxqHuXaQ"
export ADMIN_ID="237228075"
while true; do
  echo "[$(date)] Starting bot_clean.js..."
  node bot_clean.js >> /tmp/parvati-bot.log 2>&1
  echo "[$(date)] Stopped, restart in 3s..." >> /tmp/parvati-bot.log
  sleep 3
done