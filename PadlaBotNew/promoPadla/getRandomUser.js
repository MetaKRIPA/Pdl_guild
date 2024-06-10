async function getRandomUser() {
    try {
        const users = await User.find();

        if(users.length === 0) return null;

        let user = null;
        do{
            user = users[Math.floor(Math.random() * users.length)];
        }while (user?.username === undefined);

        return user;
    } catch (e) {
        Logger.Error(Logger.Mode.CRON, e.message);
    }
}

module.exports = getRandomUser;