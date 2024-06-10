async function updateAllUserData(message) {
    try {
        const users = await User.find() || [];
        for await (let user of users) {
            try {
                const dataSend = await bot.telegram.sendMessage(user.telegram, message, {parse_mode: 'HTML'});
                Logger.Message(Logger.Mode.PROMO,"Сообщение отправлено пользователю: " + user.telegram);
                await User.updateOne({telegram:user.telegram}, {first_name:dataSend.chat?.first_name || null, last_name:dataSend.chat?.last_name || null, username:dataSend.chat?.username || null});
            }catch (e) {
                Logger.Error(Logger.Mode.PROMO, e.message);
            }
        }
    } catch (e) {
        Logger.Error(Logger.Mode.PROMO, e.message);
    }
}

module.exports = updateAllUserData;