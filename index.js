const { config } = require(`dotenv`);
const { Telegraf } = require(`telegraf`);
config();

const bot = new Telegraf(process.env.TOKEN);

const cap = (string) => string[0].toUpperCase() + string.slice(1);

bot.use(async (ctx, next) => {
  try {
    try {
      await next();
    } catch (e) {
      await ctx.reply(cap(e.response.description.replace(`Bad Request: `, ``)));
    }
  } catch (e) {
    console.log(e);
  }
});

bot.start(
  async (ctx) =>
    await ctx.reply(
      `This bot provide ability for users to send location messages by coordinates. Simply open any of your chats and type <code>@getlocbot coordinate</code> in the message field. Then tap on a result to send.\n\nFor example, try typing <code>@getlocbot 40.689356, -74.044629</code> here.`,
      {
        parse_mode: `HTML`,
        reply_markup: {
          inline_keyboard: [
            [{ text: `Try`, switch_inline_query: `40.689356, -74.044629` }],
          ],
        },
      }
    )
);

bot.on(`text`, async (ctx) => {
  const [latitude, longitude] = ctx.message.text.split(`,`);
  return await ctx.replyWithLocation(latitude, longitude);
});

bot.on("inline_query", async (ctx) => {
  const [latitude, longitude] = ctx.inlineQuery.query.split(`,`);
  return await ctx.answerInlineQuery([
    {
      type: `location`,
      id: 1,
      title: `Location message`,
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0,
    },
  ]);
});

bot.launch();
