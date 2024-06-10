const getId = require("../../getId");
const isGroup = require("../../isGroup");

module.exports = async function () {

    bot.hears('Чаты', async (ctx) => {
        try {
            if (await isGroup(ctx)) return;

            const dbData = await User.findOne({telegram: await getId(ctx), status:"authorization"});
            if(!dbData) return;

            const buttonData = [];

            Chats.forEach(chat => {
               buttonData.push([{
                   text: chat.name,
                   url: chat.url
               }])
            });

            await ctx.reply("Список чатов <b>PADLA GUILD</b>:", {
                parse_mode: 'Html',
                reply_markup: {
                    inline_keyboard: buttonData
                }
            });
        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message + ` ${await getId(ctx)}`);
        }
    });

}