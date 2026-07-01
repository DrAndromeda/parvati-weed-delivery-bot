// Parvati 420 Bot — Start with .env or environment variables
// 1. Reads BOT_TOKEN and ADMIN_ID from .env file
// 2. Falls back to environment variables
// 3. Then requires bot.js

const fs = require('fs');
const path = require('path');

// Try loading .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

// Validate
if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN not set. Create .env file with:\n  BOT_TOKEN=your_token\n  ADMIN_ID=your_id');
  process.exit(1);
}
if (!process.env.ADMIN_ID) {
  console.error('❌ ADMIN_ID not set. Create .env file with:\n  BOT_TOKEN=your_token\n  ADMIN_ID=your_id');
  process.exit(1);
}

console.log('🔑 BOT_TOKEN loaded, ADMIN_ID:', process.env.ADMIN_ID);

// Start the bot
require('./bot.js');
