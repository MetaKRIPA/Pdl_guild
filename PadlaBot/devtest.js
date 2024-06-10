const getId = require("./getId");
const Markup = require("telegraf").Markup;

module.exports = async function () {

    bot.hears('/checker', async (ctx) => {
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


            const first_name = ctx.update.message.from.first_name || undefined;
            const last_name = ctx.update.message.from.last_name || undefined;
            const username = ctx.update.message.from.username || undefined;

            const UserCheck = await User.findOne({telegram: ctx.update.message.from.id}) || [];

            if(UserCheck.length !== 0){
                await User.updateOne({telegram: ctx.update.message.from.id}, {
                    first_name: first_name,
                    last_name: last_name,
                    username: username
                }).then(() => {
                    Logger.Message(Logger.Mode.DATABASE, `Получена информация о пользователе ( ${ctx.update.message.from.id} )`);
                })

                await ctx.reply(`Идентификация пройдена. Спасибо что выбрали PADLA сообщество 😉`);
            }

        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message);
        }
    });

    bot.hears('/sendAllUser', async (ctx) => {
        try {
            Logger.Message(Logger.Mode.SERVER, `Вызвана команда для тестирования ( ${await getId(ctx)} )`);

            const _user = await User.find();
            _user.forEach(async (u) => {
                try {
                    await ctx.telegram.sendMessage(u.telegram, `Привет 👋

Да да, к тебе бот обращается, думал у меня нет такой возможности? А вот и не угадал 🙃

Так вот, я вообще-то по делу к тебе… Ходят слухи, что среди нас есть предатель который прячется под обличием бота, и каждую ночь делает мне нервы, ну вот как так можно? 😒

К чему я веду… Не мог бы ты нажать на вот эту волшеебную кнопочку: /checker , для того чтобы я убедился, что ты настоящий человек, а не какой-то там безумный бот? 😎

Буду тебе краааайне благодарен 💎`)
                    Logger.Message(Logger.Mode.PRIVATE, "Сообщение о проверке отправлено пользователю: " + u.telegram)
                }catch (e) {
                    Logger.Error(Logger.Mode.PRIVATE, e.message);
                }

            })

        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message);
        }
    });

}