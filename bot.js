const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;

if (!token || !chatId) {
  console.error('❌ Errore: TELEGRAM_TOKEN o CHAT_ID non configurati!');
  process.exit(1);
}

const bot = new TelegramBot(token);

const data = require('./filastrocche.json');
const filastrocche = data.filastrocche;

// Ogni giorno alle 8:00 CET (7:00 UTC)
cron.schedule('0 7 * * *', () => {
  const random = filastrocche[Math.floor(Math.random() * filastrocche.length)];
  bot.sendMessage(chatId, random, { parse_mode: 'Markdown' })
    .then(() => console.log('✅ Filastrocca inviata!'))
    .catch(err => console.error('❌ Errore invio:', err));
});

bot.on('message', (msg) => {
  if (msg.text === '/start') {
    const id = msg.chat.id;
    console.log('📱 Chat ID richiesto:', id);
    bot.sendMessage(id, `✅ Il tuo Chat ID è: \`${id}\`\n\nCopia questo numero nella variabile CHAT_ID su Render!`, { parse_mode: 'Markdown' });
  }
});

bot.startPolling();
console.log('🤖 Bot avviato! In ascolto...');
