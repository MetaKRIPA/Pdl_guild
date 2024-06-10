const getId = require("./getId");
const Markup = require("telegraf").Markup;

module.exports = async function () {

    bot.hears('/devtest', async (ctx) => {
        try {
            Logger.Message(Logger.Mode.SERVER, `Вызвана команда для тестирования ( ${await getId(ctx)} )`);

            //Chat
            //await bot.telegram.kickChatMember(-1001722834076, 1471123906);
            //await bot.telegram.unbanChatMember(-1001722834076, 1471123906);

            //Canal
            //await bot.telegram.kickChatMember(-1001617337493, 1471123906);
            //await bot.telegram.unbanChatMember(-1001617337493, 436650398);

            /*await ctx.reply("Создание кнопки", {
                reply_markup: 'markdown',
                parse_mode: 'Html',
                ...Markup.keyboard([
                    'Оплатил'
                ]).resize()})*/

            await ctx.replyWithVideo('https://padla.qteam.digital/welcome.gif',
                {
                    caption: `Привет, ты на <b>PADLA</b> районе! 👹 Че как оно?\n\nЕсли хочешь узнать больше о проекте, жми "<b>ИНФА</b>"\n\nЕсли у тебя уже есть <b>PADLA NFT</b>, жми "<b>Гильдия</b>" и вступай в наши ряды 🤖\n\n<u>Ну, а если ты уже со всем ознакомился, но остались какие-то вопросы, то задавай их прямо здесь. И мы поможем тебе до конца во всём разобраться</u> 🤗`,
                    parse_mode: 'Html',
                    reply_markup: {
                        inline_keyboard: [
                            [ { text: "🔎 ИНФА", url: "https://t.me/PADLA_PROJECT/109" }, { text: "😎 ГИЛЬДИЯ", url: "https://t.me/padlanft_bot" } ],
                        ]
                    }
                });



        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message);
        }
    });

}