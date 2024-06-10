const Markup = require("telegraf").Markup;
const getId = require("../../getId");
module.exports = async function () {

    bot.hears('Выйти', async (ctx) => {

        try {

            const dbData = await User.findOne({telegram: await getId(ctx), status: "authorization"});
            if (!dbData) return;

            await dbData.deleteOne({telegramID: await getId(ctx)}).then(async () => {
                Logger.Message(Logger.Mode.DATABASE, `Пользователь успешно удалён ( ${await getId(ctx)} )`);
            });

            Logger.Message(Logger.Mode.PRIVATE, `Пользователь вышел с аккаунта ( ${await getId(ctx)} )`);
            await ctx.reply(`Вы вышли из своего аккаунта <b>PADLA GUILD</b>`, {
                parse_mode: 'Html',
                ...Markup.keyboard([
                    ['Авторизация']
                ]).resize(),
            });
        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, `${e.message} ( ${await getId(ctx)} )`);
        }

    });
}