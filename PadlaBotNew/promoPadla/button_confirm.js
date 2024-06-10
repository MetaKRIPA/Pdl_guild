const SendTon = require("./SendTon");

module.exports = async function(){
    bot.action(/promo_buttonConfirm__.+/, async (ctx) => {
        try {
            const callbackData = ctx.match[0];
            const parts = callbackData.split('__');
            const data = parts[1];
            const dataFilter = data.split("!");
            const id = dataFilter[0];
            const username = dataFilter[1];

            await ctx.editMessageText(`🤖 Участник @${username} ( ${id} ) был выбран для получения награды.\n\n <b>[ ✅ Подтвердить ]</b>`, {
                parse_mode: 'HTML',
            });

            const user = await User.findOne({telegram:id}) || null;

            if(user === null)
                return Logger.Error(Logger.Mode.PROMO, `Пользователь с айди ${id} не обнаружен в базе данных`);

            if(user?.wallet === undefined)
                return Logger.Error(Logger.Mode.PROMO, `У пользователь с айди ${id} не обнаружено адреса кошелька`);

            const isSend = await SendTon(user.wallet , 1, "👹 PADLA PROMO 🔗");

            const chatId = -1002081745188;

            if(isSend) {
                await bot.telegram.sendMessage(id, `<b>🥳 Сегодня твой счастливый день!</b>\n\n<span class="tg-spoiler">Тебе на кошелёк отправлен 1 💎</span>\n\n<b>Спасибо за вклад в узнаваемость проекта 🙏 💟</b>`, { parse_mode: 'HTML'});
                await bot.telegram.sendMessage(chatId, `✅ <b>Успешная</b> отправка средств пользователю:\n\n( ${id} ) @${username}\n\nНа кошелек: <code>${user.wallet}</code>`, {parse_mode: 'HTML'});
                await bot.telegram.sendPhoto(-1001776372932, "https://padla.qteam.digital/padla_promo.jpg",{ caption: "<a href='https://t.me/padlanft_bot'><b>PADLA PROMO</b></a>\n\n🥳 Сегодня удача выбрала @"+username+"\n💰 <u>Награда:</u> 1💎\n\n<b>Спасибо за твой вклад в узнаваемость проекта 🙏 💟</b>", parse_mode: 'HTML'});

            }else{
                await bot.telegram.sendMessage(chatId, `❌ <b>Ошибка</b> при отправке средств пользователю:\n\n( ${id} ) @${username}\n\nна кошелек: <code>${user.wallet}</code>`, {parse_mode: 'HTML'});
            }
        }catch (e) {
            Logger.Error(Logger.Mode.PROMO, e.message)
        }
    });
}

