async function promoBot() {
    try {
        const users = await User.find() || [];
        users.forEach(async user => {
           if(user.telegram == "724415959"){
               const dataSend = await bot.telegram.sendMessage(user.telegram, "TEST", {parse_mode: 'HTML'});
               console.log("Сообщение отправлено пользователю: " + user.telegram);
               console.log(dataSend);
           }
        });
    } catch (e) {
        Logger.Error(Logger.Mode.CRON, e.message);
    }
}

module.exports = promoBot;