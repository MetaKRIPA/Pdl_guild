const Markup = require("telegraf").Markup;

module.exports = async function (user) {
    try {

        if (user.statusNFT) {
            Logger.Message(Logger.Mode.PRIVATE, `Отправлено сообщение о необходимости покупки NFT ( ${user.telegram} )`);

            await bot.telegram.sendMessage(user.telegram, "⚠️ <b>ПРЕДУПРЕЖДЕНИЕ</b> ⚠️\n" +
                "У вас не обнаружено NFT. \n" +
                "\n" +
                "<u>Через 24 часа вы будете исключены из Гильдии.</u> \n",
                {
                    parse_mode: 'Html',
                    ...Markup.keyboard([
                        ['Проверить наличие NFT'],
                        ['Каналы','Чаты'],
                        ['Профиль', 'Выйти']
                    ]).resize(),
                });

            await User.updateOne({telegram: user.telegram}, {nfts: [], statusNFT: false}).then(() => {
                Logger.Message(Logger.Mode.DATABASE, `Изменение статуса NFT пользователя ( ${user.telegram} )`);
            })
        } else {
            Logger.Message(Logger.Mode.PRIVATE, `Отправлено сообщение об исключении пользователя ( ${user.telegram} )`);

            for await (let chat of Chats) {
                await bot.telegram.kickChatMember(chat.id, user.telegram);
                Logger.Message(Logger.Mode.REMOVE, `Пользователь был удалён с чата ${chat.id} ( ${user.telegram} )`);
            }

            for await (let channel of Channel) {
                await bot.telegram.kickChatMember(channel.id, user.telegram);
                Logger.Message(Logger.Mode.REMOVE, `Пользователь был удалён с канала ${channel.id} ( ${user.telegram} )`);
            }
            
            await User.deleteOne({telegram:user.telegram}).then(() => {
               Logger.Message(Logger.Mode.DATABASE, `Пользователь был удалён ( ${user.telegram} )`);
            });

            await new RemoveUser({ telegram: user.telegram}).save(async () => {
                Logger.Message(Logger.Mode.DATABASE, `Пользователя помечено как заблокированого ( ${user.telegram} )`);
            })
            

            await bot.telegram.sendMessage(user.telegram, "<u>Вы были исключены из Гильдии</u> 😔", {
                reply_markup: 'markdown',
                parse_mode: 'Html',
                ...Markup.keyboard([
                    'Авторизация'
                ]).resize()
            });
        }

    } catch (e) {
        Logger.Warn(Logger.Mode.CRON, e.message + ` ( ${user.telegram} )`)
    }
}
