const getId = require("../../getId");
const isGroup = require("../../isGroup");

module.exports = async function () {

    bot.hears('👤 Профиль', async (ctx) => {
        try {
            if (await isGroup(ctx)) return;

            const dbData = await User.findOne({telegram: await getId(ctx), status:"authorization"});
            if(!dbData) return;

            await ctx.reply(`👤 <b>Профиль</b>

🪪 <b>Имя:</b> ${(ctx.update.message.from.username || ctx.update.message.from.first_name || 'ПАДЛА')}
💳 <b>Кошель:</b> <code>${dbData.wallet}</code>
🖼 <b>NFT:</b> ${dbData.nfts.length}`, { parse_mode: 'Html' });


        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message + ` ${await getId(ctx)}`);
        }
    });

}