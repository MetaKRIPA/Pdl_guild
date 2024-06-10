const checkUser = require("./checkUser");

module.exports = async function () {
    try{
        const users = await User.find();

        if(users) await checkUser(users, users.length);
    }catch (e){
        Logger.Error(Logger.Mode.CRON, e.message);
    }
}