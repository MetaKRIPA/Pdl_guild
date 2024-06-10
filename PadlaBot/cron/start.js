const getUsers = require("./getUsers");

async function func(hours) {
    try {
        //setTimeout(() => {
            //const date = new Date();
            //if (date.getHours() === hours) {
                setInterval(async () => {
                    Logger.Message(Logger.Mode.CRON, "Начало проверки NFT");
                    await getUsers();
                }, 1000 * 60 * 10);
            //} else {
                //func(hours);
            //}
        //}, 1000 * 60 * 10);
    } catch (e) {
        Logger.Error(Logger.Mode.CRON, e.message);
    }
}

module.exports = func;