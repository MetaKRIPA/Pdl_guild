const Markup = require("telegraf").Markup;
const getId = require("../getId");
const isGroup = require("../isGroup");
const {execFile} = require('node:child_process');
const getNFT = require('./getNFT');
const getSaleNFT = require('./getSaleNFT');

module.exports = async function () {
    bot.hears('Авторизация', async (ctx) => {
        try {
            if (await isGroup(ctx)) return;

            const dbData = await User.findOne({telegram: getId(ctx)});
            if(!dbData || !dbData.wallet) {
                if(!dbData) {
                    await new User({
                        telegram: getId(ctx),
                        first_name: ctx.update.message.chat?.first_name || null,
                        last_name: ctx.update.message.chat?.last_name || null,
                        username: ctx.update.message.chat?.username || null,
                        status: "authorization",
                        wallet: '',
                        nfts: []
                    }).save(async () => {
                        Logger.Message(Logger.Mode.DATABASE, `Пользователь успешно добавлен ( ${getId(ctx)} )`)
                    })
                }
                console.log('./profile/tonkeeper/auth.js');
                const ress = execFile('node', ['./profile/tonkeeper/auth.js', getId(ctx)], (error, stdout, stderr) => {
                    console.log('stdout', stdout);
                    if (error) {
                        console.log('error', error);
                    }
                    console.log(stderr);
                });

                ress.on('close', async (code) => {
                    console.log('code', code);
                    if(code === 0) {
                        const user = await User.findOne({telegram: getId(ctx)});
                        const _getNFT = await getNFT(user.wallet, getId(ctx));
                        console.log('getNFT', _getNFT);
                        const _getSaleNFT = await getSaleNFT(user.wallet, getId(ctx));
                        console.log('_getSaleNFT', _getSaleNFT);
                        const nftUser = _getNFT.concat(_getSaleNFT);

                        if(nftUser.length !== 0){
                            Logger.Message(Logger.Mode.NFT, `В пользователя обнаружено ${nftUser.length} нужных NFT ( ${_id} )`);

                            await ctx.replyWithAnimation("https://tgbot.qteam.digital/padla/welcome.mp4",
                                {
                                    caption: 'Ура, теперь ты <b>PADLA</b>. \n' +
                                        'Добро пожаловать в Гильдию 🤗',
                                    parse_mode: 'Html',
                                    ...Markup.keyboard([
                                        ['👥 Каналы','💬 Чаты'],
                                        ['👤 Профиль', '✖️ Выйти']
                                    ]).resize(),
                                });

                            const removeUser = await RemoveUser.findOne({telegram: getId(ctx)});

                            if(removeUser){
                                for await (let chat of Chats) {
                                    await bot.telegram.unbanChatMember(chat.id, getId(ctx));
                                    Logger.Message(Logger.Mode.REMOVE, `Пользователь был разблокирован в чате ${chat.id} ( ${getId(ctx)} )`);
                                }

                                for await (let channel of Channel) {
                                    await bot.telegram.unbanChatMember(channel.id, getId(ctx));
                                    Logger.Message(Logger.Mode.REMOVE, `Пользователь был разблокирован в канале ${channel.id} ( ${getId(ctx)} )`);
                                }

                                await RemoveUser.deleteOne({telegram: getId(ctx)}).then(async () => {
                                    Logger.Message(Logger.Mode.DATABASE, `Пользователь удалён с RemoveUser ( ${getId(ctx)} )`);
                                });
                            }
                            await User.findByIdAndUpdate(user._id, {
                                nfts: nftUser
                            })

                            Logger.Message(Logger.Mode.PRIVATE, `Совершен вход в аккаунт ( ${getId(ctx)} )`);
                        } else {
                            Logger.Message(Logger.Mode.NFT, `В пользователя не обнаружено нужных NFT ( ${getId(ctx)} )`);
                            await User.deleteOne({telegram: getId(ctx)}).then(async () => {
                                Logger.Message(Logger.Mode.DATABASE, "Пользователь удалён" + ` ( ${getId(ctx)} )`)
                            });


                            await ctx.reply(`<b>🤷‍♂ К сожалению, у вас нет ни одной <b><a href="https://getgems.io/collection/padla-bear">PADLA NFT</a></b>.</b>\n\nДля того, чтобы узнать как её приобрести и получить подробную информацию о проекте, нажмите кнопку "<b>ИНФА</b>"`, {
                                parse_mode: 'Html',
                                reply_markup: {
                                    inline_keyboard: [ [{text: "ИНФА", url: "https://t.me/PADLA_BEAR_COR_OF_G/109"}] ]
                                }
                            });


                        }
                    }
                });
            }



        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message);
        }
    });

}
