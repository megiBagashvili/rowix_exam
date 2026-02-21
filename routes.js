
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;;
const bot = new TelegramBot(token, { polling: true });
const chatId = process.env.CHATID;

bot.sendMessage(chatId, 'Server started');


bot.onText(/^\/(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const currencyCode = match[1].split('@')[0].toUpperCase();
    if (currencyCode === 'ALL' || currencyCode === 'START' || currencyCode === 'ALL@ALKASD_BOT' || currencyCode === 'START@ALKASD_BOT') {
        return;
    } else {
        fetch('https://rowix.com/currencies.php')
        .then(response => response.json())
        .then(data => {
            const currency = data.find(c => c.code === currencyCode);
            if (currency) {
                bot.sendMessage(chatId, `${currency.code}: ${currency.rate}`);
            } else {
                bot.sendMessage(chatId, 'Currency not found');
            }
        })
        .catch(err => {
            bot.sendMessage(chatId, 'Failed to fetch currency details');
        });
    }
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! Welcome! This is currency Bot. You can send me a currency code and I will return the current exchange rate for that currency.');
});


bot.onText(/\/all/, async (msg) => {
    try {
        const chatId = msg.chat.id;
        const response = await fetch('https://rowix.com/currencies.php');
        const data = await response.json();
        let message = '';
        for (let currency of data) {
            message += `${currency.code}: ${currency.rate}\n`;
        }
        bot.sendMessage(chatId, message);
    }catch (err) {
        bot.sendMessage(chatId, 'Failed to fetch currencies');
    }
});


bot.on('polling_error', (error) => {
    console.log(error);
});
