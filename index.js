const { Telegraf, Markup } = require('telegraf');


const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = '7738927680'; // Your Telegram user ID as admin

// Maps admin reply message ID to user ID
const replyMap = new Map();

// === Start Menu ===
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

// === Action Handlers ===
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

const responses = {
  REVIEW: '📉 TRADE SETUP REVIEW\n\nPlease send the following:\n- 📸 A screenshot of your chart (MT4/MT5 or TradingView)...',
  ACCOUNT: '📊 ACCOUNT HEALTH CHECK\n\nPlease send:\n- 📸 Screenshot of your account summary...',
  PSYCH: '🧠 TRADE PSYCHOLOGY SUPPORT\n\nFeeling anxious, revenge trading, etc...',
  FUNDED: '🏆 FUNDED ACCOUNT RISK ADVICE\n\nTaking a prop firm challenge? Please send...',
  EMERGENCY: '🚨 EMERGENCY LIQUIDATION HELP\n\nIf you\'re close to a margin call or liquidation...',
};

Object.entries(responses).forEach(([key, message]) => {
  bot.action(key, (ctx) => {
    sendAnswer(ctx, message);
    ctx.answerCbQuery();
  });
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

// === User Message Forwarding ===
bot.on('message', async (ctx) => {
  if (`${ctx.from.id}` === ADMIN_ID) return; // Don’t process your own messages

  const userId = ctx.from.id;
  const name = ctx.from.username ? `@${ctx.from.username}` : `${ctx.from.first_name} ${ctx.from.last_name || ''}`;

  let forwarded;
  if (ctx.message.text) {
    forwarded = await bot.telegram.sendMessage(
      ADMIN_ID,
      `📩 Message from ${name} (${userId}):\n\n${ctx.message.text}`
    );
  } else if (ctx.message.photo) {
    const caption = ctx.message.caption || '';
    forwarded = await bot.telegram.sendPhoto(
      ADMIN_ID,
      ctx.message.photo[ctx.message.photo.length - 1].file_id,
      { caption: `📷 From ${name} (${userId}): ${caption}` }
    );
  } else {
    forwarded = await bot.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
  }

  // Save mapping of message ↔ user
  if (forwarded) {
    replyMap.set(forwarded.message_id, userId);
  }
});

// === Admin Replies Back ===
bot.on('text', async (ctx) => {
  if (`${ctx.from.id}` !== ADMIN_ID) return;

  const replyTo = ctx.message.reply_to_message;
  if (replyTo && replyMap.has(replyTo.message_id)) {
    const targetUserId = replyMap.get(replyTo.message_id);
    await bot.telegram.sendMessage(targetUserId, `📬 Admin: ${ctx.message.text}`);
  }
});

bot.launch();
console.log('✅ Bot is running...');
