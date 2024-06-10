const isGroup = require("../isGroup");
const getId = require("../getId");
const Markup = require("telegraf").Markup;

module.exports = async function () {
    await bot.start(async (ctx) => {

        try {
            if (await isGroup(ctx)) return;

            const dbData = await User.findOne({telegram: await getId(ctx)});

            if (dbData !== null) return null;

            Logger.Message(Logger.Mode.PRIVATE, `Вызвана команда /start ( ${await getId(ctx)} )`);

            const AnimationUrl1 = 'https://tgbot.qteam.digital/padla/start.mp4'

            await ctx.replyWithAnimation(AnimationUrl1,
                {
                    caption: 'Остался последний шаг на пути к становлению <b>Падлой</b> 👹\n' +
                        '\n' +
                        '<u>Пройди авторизацию и вступай в наши ряды.</u>',
                    parse_mode: 'Html',
                    ...Markup.keyboard([
                        'Авторизация'
                    ]).resize(),
                });

            /*ctx.reply(`Дарова, давайка пройдём авторизацию`,
                Markup.keyboard(['Авторизация']).resize()
            );*/
        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message);
        }
    })
}