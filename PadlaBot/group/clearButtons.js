const Markup = require("telegraf").Markup;
const isGroup = require("../isGroup");

module.exports = async function () {
    bot.hears('/clearbutton', async (ctx) => {
        try {

            return;

            if (!await isGroup(ctx)) return;

            await ctx.reply("Очистка...", Markup.removeKeyboard());


        } catch (e) {
            Logger.Error(Logger.Mode.GROUP, e.message);
        }
    });

}