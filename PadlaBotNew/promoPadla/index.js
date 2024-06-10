const getRandomUser = require("./getRandomUser");
const chatId = -1002081745188;

async function promoBot() {
    try {
        const user = await getRandomUser();
        if(user === null) return await bot.telegram.sendMessage(chatId, "Подходящих юзеров не обнаружено", {parse_mode: 'HTML'});

        await bot.telegram.sendMessage(chatId, `🤖 Участник @${user.username} был выбран для получения награды.`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{
                    text: '✅ Подтвердить',
                    callback_data: 'promo_buttonConfirm__' + user.telegram + "!" + user.username
                    }],[{
                    text: '❌ Ава',
                    callback_data: 'promo_buttonAvatar__' + user.telegram + "!" + user.username
                    }],[{
                    text: '❌ Ссылка',
                    callback_data: 'promo_buttonLink__' + user.telegram + "!" + user.username
                    }],[{
                    text: '❌ Ава + Ссылка',
                    callback_data: 'promo_buttonAvatarAndLink__' + user.telegram + "!" + user.username
                    }],[{
                    text: '🔄 Обновить',
                    callback_data: 'promo_reload__' + user.telegram + "!" + user.username
                    }]
                ]
            }
        })

    } catch (e) {
        Logger.Error(Logger.Mode.CRON, e.message);
    }
}

module.exports = promoBot;