require('dotenv').config();

const { Telegraf } = require('telegraf');

// Verify token
if (!process.env.BOT_TOKEN) {
  console.error('❌ ERROR: Bot token not found! Check your .env file');
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Set bot commands (must follow Telegram's requirements)
const setCommands = async () => {
  try {
        await bot.telegram.setMyCommands([
        { command: 'carcall', description: '🚖 Request a taxi' },
        { command: 'prices', description: '💰 View price list' },
        { command: 'contact', description: '📞 Contact information' }
        ], {
        scope: {
            type: 'all_group_chats'
        }
    });
    console.log('✅ Bot commands set successfully');
  } catch (err) {
    console.error('❌ Error setting commands:', err.message);
  }
};

// Price list data
const priceList = `
<b>🚖 SKK Premium Taxi Price List</b>

• ရထိုက်အတွင်း - 100b
• ဆိုက်4 - 200b 
• ဆိုက်5 - 300b
• 亚太里面 (ရထိုက်အတွင်း) - 100b
• ရွေကုက္ကိုအတွင်း - 100b
`;

// Contact information
const contactInfo = `
<b>📞 Contact SKK Premium Taxi</b>

• Phone 1: <a href="tel:09684562181">09684562181</a>
• Phone 2: <a href="tel:09699093888">09699093888</a>
• Telegram: <a href="https://t.me/skktaxii">@skktaxii</a>
`;

// Car call command
bot.command('carcall', (ctx) => {
  ctx.replyWithHTML(`

${priceList}

${contactInfo}

Please specify your location and preferred time.
  `, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📞 Call Now-> 09684562181', callback_data: 'call_1' }],
        [{ text: '📞 Call Now-> 09699093888', callback_data: 'call_2' }],
        [{ text: '📱 Message on Telegram', url: 'https://t.me/skktaxii' }]
      ]
    }
  });
});

// Price list command
bot.command('prices', (ctx) => {
  ctx.replyWithHTML(priceList);
});

// Contact command
bot.command('contact', (ctx) => {
  ctx.replyWithHTML(contactInfo, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📞 Call Now', callback_data: 'show_numbers' }]
      ]
    }
  });
});

// Handle button clicks with proper error handling
bot.action('call_1', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.reply('ဆက်သွယ်ရန်ဖုန်း : 09684562181');
  } catch (err) {
    console.error('Error in call_1:', err.message);
  }
});

bot.action('call_2', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.reply('ဆက်သွယ်ရန်ဖုန်း : 09699093888');
  } catch (err) {
    console.error('Error in call_2:', err.message);
  }
});

bot.action('show_numbers', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.replyWithHTML(contactInfo);
  } catch (err) {
    console.error('Error in show_numbers:', err.message);
  }
});

bot.action('book_taxi', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.replyWithHTML(`
<b>🚖 Taxi Booking</b>
${priceList}
${contactInfo}
Please send your location and preferred time.
    `);
  } catch (err) {
    console.error('Error in book_taxi:', err.message);
  }
});

// Welcome message for new members with error handling
bot.on('new_chat_members', async (ctx) => {
  try {
    for (const member of ctx.update.message.new_chat_members) {
      await ctx.replyWithHTML(`
<b>မင်္ဂလာပါ ${member.first_name}! 👋</b>
SKK Premium Taxi Serviceမှ ကြိုဆိုပါသည်။

${priceList}

${contactInfo}
      `, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚖 Book Now', callback_data: 'book_taxi' }],
            [{ text: '📞 Contact Us', callback_data: 'show_numbers' }]
          ]
        }
      });
    }
  } catch (err) {
    console.error('Error welcoming new member:', err.message);
  }
});

// Initialize and start the bot
setCommands().then(() => {
  bot.launch()
    .then(() => console.log('✅ Bot started successfully'))
    .catch(err => console.error('❌ Bot failed to start:', err.message));
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));