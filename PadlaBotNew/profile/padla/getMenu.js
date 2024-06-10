const getId = require("../../getId");
const isGroup = require("../../isGroup");

module.exports = async function () {

    bot.hears('PADLA GUILD', async (ctx) => {
        try {
            if (await isGroup(ctx)) return;

            const dbData = await User.findOne({telegram: await getId(ctx), status:"authorization"});
            if(!dbData) return;

            await ctx.reply(`Имя: ${ctx.update.message.from.username || ctx.update.message.from.first_name || 'ПАДЛА'}\n` +
                `Кошель: ${dbData.wallet}Оп \n` +
                `NFT: ${dbData.nfts.length} \n`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Channel1", url: "https://t.me/PADLA_BEAR_COR_OF_G"},],
                        [{text: "Channel2 🆕", url: "https://telegra.ph/WHITE-PAPER-PADLA-BEAR-04-24"}],
                        [{text: "Channel3", url: "http://padlabear.tilda.ws/"}],
                        [{text: "Выйти", callback_data: "exitWallet"}]
                    ]
                }
            });
        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message + ` ${await getId(ctx)}`);
        }
    });

}