const getId = require("../getId");
const Markup = require("telegraf").Markup;
const isGroup = require("../isGroup");
const checkTransaction = require("../checkTransaction");
const checkSpecificTransaction = require("../checkSpecificTransaction");
const getNFT = require("./getNFT");
const getSaleNFT = require("./getSaleNFT");

const g_checker = [];

module.exports = async function () {

    bot.hears('Оплатил', async (ctx) => {
        try {
            const _id = getId(ctx);

            if (g_checker.includes(_id)) return;

            g_checker.push(_id);

            const waitOrderText = "Ожидание оплаты\n\n<u>❗️Бот проверяет оплату, только за последние 3 дня. Если этот срок истёк, то для повторной авторизации требуется снова провести транзакцию для подключения кошелька. ❗️</u>";

            if (await isGroup(ctx)) return;

            const dbData = await User.findOne({telegram: _id});
            if(dbData) return;

            await ctx.reply("Проверка...");


            const getAllTransactions = await checkTransaction(_id);

            if(getAllTransactions){

                const getSpecificTransaction = await checkSpecificTransaction(getAllTransactions, ctx);
                if(getSpecificTransaction.status){
                    Logger.Message(Logger.Mode.AXIOS, `Оплата успешно проведена ( ${_id} )`);


                    ctx.reply("Оплата принята. Осуществляем проверку нужных NFT...");
                    const _getNFT = await getNFT(getSpecificTransaction.wallet, _id);
                    const _getSaleNFT = await getSaleNFT(getSpecificTransaction.wallet, _id);
                    const nftUser = _getNFT.concat(_getSaleNFT);
                    if(nftUser.length !== 0){
                        Logger.Message(Logger.Mode.NFT, `В пользователя обнаружено ${nftUser.length} нужных NFT ( ${_id} )`);

                        const myIndex = g_checker.indexOf(_id);
                        if (myIndex !== -1) g_checker.splice(myIndex, 1);

                        await ctx.replyWithAnimation("https://tgbot.qteam.digital/padla/welcome.mp4",
                            {
                                caption: 'Ура, теперь ты <b>PADLA</b>. \n' +
                                    'Добро пожаловать в Гильдию 🤗',
                                parse_mode: 'Html',
                                ...Markup.keyboard([
                                    ['Каналы','Чаты'],
                                    ['Профиль', 'Выйти']
                                ]).resize(),
                            });

                        const removeUser = await RemoveUser.findOne({telegram: _id});

                        if(removeUser){
                            for await (let chat of Chats) {
                                await bot.telegram.unbanChatMember(chat.id, _id);
                                Logger.Message(Logger.Mode.REMOVE, `Пользователь был разблокирован в чате ${chat.id} ( ${_id} )`);
                            }

                            for await (let channel of Channel) {
                                await bot.telegram.unbanChatMember(channel.id, _id);
                                Logger.Message(Logger.Mode.REMOVE, `Пользователь был разблокирован в канале ${channel.id} ( ${_id} )`);
                            }

                            await RemoveUser.deleteOne({telegram: await _id}).then(async () => {
                               Logger.Message(Logger.Mode.DATABASE, `Пользователь удалён с RemoveUser ( ${_id} )`);
                            });
                        }

                        await new User({
                            telegram: _id,
                            status: "authorization",
                            wallet: getSpecificTransaction.wallet,
                            nfts: nftUser
                        }).save(async () => {
                            Logger.Message(Logger.Mode.DATABASE, `Пользователь успешно добавлен ( ${_id} )`)
                        })
                        Logger.Message(Logger.Mode.PRIVATE, `Совершен вход в аккаунт ( ${_id} )`);
                    }else{
                        Logger.Message(Logger.Mode.NFT, `В пользователя не обнаружено нужных NFT ( ${_id} )`);
                        await User.deleteOne({telegram:_id}).then(async () => {
                            Logger.Message(Logger.Mode.DATABASE, "Пользователь удалён" + ` ( ${_id} )`)
                        });


                        await ctx.reply(`<b>К сожалению, у вас нет ни одной PADLA NFT.</b>\n\nДля того, чтобы узнать как её приобрести и получить подробную информацию о проекте, нажмите кнопку "<b>ИНФА</b>"`, {
                            parse_mode: 'Html',
                            reply_markup: {
                                inline_keyboard: [ [{text: "ИНФА", url: "https://t.me/PADLA_BEAR_COR_OF_G/109"}] ]
                            }
                        });

                        const myIndex = g_checker.indexOf(_id);
                        if (myIndex !== -1) g_checker.splice(myIndex, 1);

                    }
                }else{
                    Logger.Message(Logger.Mode.AXIOS, `Оплата не обнаружена ( ${_id} )`);

                    const myIndex = g_checker.indexOf(_id);
                    if (myIndex !== -1) g_checker.splice(myIndex, 1);

                    await ctx.reply(waitOrderText, {
                        reply_markup: 'markdown',
                        parse_mode: 'Html',
                        ...Markup.keyboard([
                            'Оплатил'
                        ]).resize()
                    })
                }

            }else{

                const myIndex = g_checker.indexOf(_id);
                if (myIndex !== -1) g_checker.splice(myIndex, 1);

                await ctx.reply(waitOrderText, {
                    reply_markup: 'markdown',
                    parse_mode: 'Html',
                    ...Markup.keyboard([
                        'Оплатил'
                    ]).resize()
                })
            }

        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message);
        }
    });

}