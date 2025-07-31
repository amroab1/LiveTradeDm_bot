const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);


bot.start((ctx) => {
  ctx.reply(
    '👋 Welcome to Live Trade Help Desk™\n\nChoose what you\'d like help with:',
    Markup.inlineKeyboard([
      [Markup.button.callback('📉 Trade Setup Review', 'REVIEW')],
      [Markup.button.callback('📊 Account Health Check', 'ACCOUNT')],
      [Markup.button.callback('🧠 Discipline & Psychology', 'PSYCH')],
      [Markup.button.callback('🏆 Prop Firm Performance Advice', 'FUNDED')],
      [Markup.button.callback('🚨 Emergency Liquidation Help', 'EMERGENCY')],
      [Markup.button.callback('💳 Subscription Plans', 'PLANS')],
    ])
  );
});

// Keep track of last reply message per user so we can delete it before sending new answer
const lastReplyIds = new Map();

async function sendAnswer(ctx, text) {
  try {
    const lastMessageId = lastReplyIds.get(ctx.from.id);
    if (lastMessageId) {
      await ctx.deleteMessage(lastMessageId).catch(() => {});
    }
    const sentMessage = await ctx.reply(text);
    lastReplyIds.set(ctx.from.id, sentMessage.message_id);
  } catch (err) {
    console.error('Error handling message:', err);
  }
}

bot.action('REVIEW', (ctx) => {
  sendAnswer(ctx, '📉 TRADE SETUP REVIEW\n\nPlease send the following:\n- 📸 A screenshot of your chart (MT4/MT5 or TradingView)\n- ✍️ Entry, Stop Loss, and Take Profit levels\n- ⚙️ Any strategy or idea behind the trade\n\n✅ One of our professionals will respond shortly with feedback');
  ctx.answerCbQuery();
});

bot.action('ACCOUNT', (ctx) => {
  sendAnswer(ctx, '📊 ACCOUNT HEALTH CHECK\n\nPlease send:\n- 📸 Screenshot of your account summary\n- 📄 Recent trades (last 5–10 if possible)\n- 🧮 Your balance, equity, margin level\n\nWe’ll give you a breakdown of:\n✅ Risk exposure\n✅ Lot sizing\n✅ Overtrading signs\n✅ Recommendations to stabilize your account');
  ctx.answerCbQuery();
});

bot.action('PSYCH', (ctx) => {
  sendAnswer(ctx, '🧠 TRADE PSYCHOLOGY SUPPORT\n\nFeeling:\n- Anxious?\n- Revenge trading?\n- Overthinking entries?\n- Excited?\n- Other\n\nA mindset specialist will help you re-center and act professionally.');
  ctx.answerCbQuery();
});

bot.action('FUNDED', (ctx) => {
  sendAnswer(ctx, '🏆 FUNDED ACCOUNT RISK ADVICE\n\nTaking a prop firm challenge?\n\nPlease send:\n- Screenshot of your challenge rules (drawdown, daily loss)\n- Screenshot of your trading stats / current trades\n- Your current balance, risk %, and goals\n\nWe’ll review if you\'re:\n✅ At risk of violation\n✅ Managing your lots correctly\n✅ On track to pass\n\nSupport available for FTMO, MyForexFunds, 5%ers, and more.');
  ctx.answerCbQuery();
});

bot.action('EMERGENCY', (ctx) => {
  sendAnswer(ctx, '🚨 EMERGENCY LIQUIDATION HELP\n\nIf you\'re close to a margin call or liquidation, do this now:\n\n1. Send a screenshot of all open trades\n2. Include balance, equity, margin %\n3. Tell us the pair(s) causing the issue\n\nA senior risk analyst will review and respond within 5–10 mins.\n\n⚠️ This is a high-priority, fast-response service.');
  ctx.answerCbQuery();
});

bot.action('PLANS', async (ctx) => {
  try {
    const lastMessageId = lastReplyIds.get(ctx.from.id);
    if (lastMessageId) {
      await ctx.deleteMessage(lastMessageId).catch(() => {});
    }
    const sentMessage = await ctx.reply(
      '💳 SUBSCRIPTION PLANS – Get Full Access\n\n🟢 Starter – $29/month\n* 5 live support requests per week\n\n🔵 Pro – $79/month\n* * 10 Weekly Live support Requests\n* Biweekly “Trader Accountability Report”\n\n🟣 Elite – $199/month\n* Unlimited access\n* Emergency desk priority\n* Biweekly “Trader Accountability Report”\n\nPay with USDT (Copy  Address Manually):',
      Markup.inlineKeyboard([
        [Markup.button.callback('TRC20: TE6cbin6JJ5EFVFBso6stgV9HM6X2wRgrP', 'copy_trc20')],
        [Markup.button.callback('BEP20: 0xA24313C602C240ce267367D5d3779d16A55fef52', 'copy_bep20')],
        [Markup.button.callback('SOLANA: 2rk4ZhN1ULNkuZaZodP3KR9b1bh3rZkQaA5B8YyJmuip', 'copy_solana')],
      ])
    );
    lastReplyIds.set(ctx.from.id, sentMessage.message_id);
  } catch (err) {
    console.error(err);
  }
  ctx.answerCbQuery();
});

bot.action('copy_trc20', (ctx) => {
  ctx.answerCbQuery('Address sent below — long press to copy');
  ctx.reply('TE6cbin6JJ5EFVFBso6stgV9HM6X2wRgrP');
});

bot.action('copy_bep20', (ctx) => {
  ctx.answerCbQuery('Address sent below — long press to copy');
  ctx.reply('0xA24313C602C240ce267367D5d3779d16A55fef52');
});

bot.action('copy_solana', (ctx) => {
  ctx.answerCbQuery('Address sent below — long press to copy');
  ctx.reply('2rk4ZhN1ULNkuZaZodP3KR9b1bh3rZkQaA5B8YyJmuip');
});

bot.launch();

console.log('✅ Bot is running');
