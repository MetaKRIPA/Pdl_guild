const getId = require("../getId");
const isGroup = require("../isGroup");
const getNFT = require("./getNFT");
const Markup = require("telegraf").Markup;
const getSaleNFT = require("./getSaleNFT");

module.exports = async function () {

    bot.hears('Проверить наличие NFT', async (ctx) => {
        try {
            if (await isGroup(ctx)) return;

            const dbData = await User.findOne({telegram: await getId(ctx), status:"authorization"});
            if(!dbData) return;
            
            Logger.Message(Logger.Mode.PRIVATE, `Проверка количества NFT ( ${await getId(ctx)} )`)

            const buttonData = [];

            const _getNFT = await getNFT(dbData.wallet, dbData.telegram);
            const _getSaleNFT = await getSaleNFT(dbData.wallet, dbData.telegram);
            const nftUser = _getNFT.concat(_getSaleNFT);

            if(nftUser.length !== 0){

                await bot.telegram.sendMessage(await getId(ctx), "Найдено, "+nftUser.length+" <b>PADLA NFT</b>\n\n<u>Предупреждение об исключении из Гильдии отменено</u>",
                    {
                        parse_mode: 'Html',
                        ...Markup.keyboard([
                            ['Каналы','Чаты'],
                            ['Профиль', 'Выйти']
                        ]).resize(),
                    });

                await User.updateOne({telegram: dbData.telegram}, {nfts: nftUser, statusNFT: true}).then(() => {
                    Logger.Message(Logger.Mode.DATABASE, `Обновлено количество NFT ( ${dbData.telegram} )`);
                });

            }else{
                 await ctx.reply("К сожалению, на вашем кошельке не найдено ни одной <b>PADLA NFT</b>",
                    {
                        parse_mode: 'Html',
                        ...Markup.keyboard([
                            ['Проверить наличие NFT'],
                            ['Каналы','Чаты'],
                            ['Профиль', 'Выйти']
                        ]).resize(),
                    });
            }

        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message + ` ${await getId(ctx)}`);
        }
    });

}