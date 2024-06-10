const Telegraf = require("telegraf").Telegraf;
global.Logger = require("./Logger");
const mongoose = require('mongoose');

const _getChannel = require("./data/channel");
const _getChat = require("./data/chat");

const group__newUser = require("./group/newUser");
const group__sendHelp = require("./group/sendHelp");

const profile__sendStart= require("./profile/sendStart");
const profile__setAuthorization = require("./profile/setAuthorization");
const profile__clickBuy = require("./profile/clickBuy");

const profile__padla__getMenu = require("./profile/padla/getMenu");
const profile__padla__exit = require("./profile/padla/exitProfile");
const profile__padla__getChats = require("./profile/padla/getChats");
const profile__padla__getGroup = require("./profile/padla/getGroup");
const profile__padla__getInfo = require("./profile/padla/getInfo");
const profile__padla__channel__checker = require("./profile/padla/channel_post_checker");
const profile__padla__startcall = require("./profile/padla/startCall");

const profile__checkNFT = require("./profile/checkNFT");

const cron__start = require("./cron/start");

const devtest = require("./devtest");
const clearButton = require("./group/clearButtons");

const adminPanelExpress = require('./server')

let MongoDBURI = 'mongodb://localhost/PADLA';

mongoose.connect(MongoDBURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

global.User = require("./models/user");
global.Tons = require("./models/checker");
global.RemoveUser = require("./models/removeUser");
global.bot = new Telegraf("5550932029:AAFmb6fvkRl4kL_5Dl5z0dKhUy9Q0mDEUyY");

global.Channel = _getChannel();
global.Chats = _getChat();

global.Settings = {
    //wallet: "EQBCVs0-dKEs3AdLBH1tPIfbaqlKRneq5czlpMPmVIybNCsF"
    wallet: "EQDzD1tfRGbrB123OOxu9rsYct4Wg88jXfHOmjQB9yupSiRI"
};

(async () => {
    const db = mongoose.connection;
 
    await db.on('error', console.error.bind(console, 'connection error:'));
    await db.once('open', () => {
        Logger.Warn(Logger.Mode.SERVER, "База данных успешно подключена");
    });

    adminPanelExpress.listen(8385)

    await group__newUser();
    await group__sendHelp();

    await profile__sendStart();
    await profile__setAuthorization();
    await profile__clickBuy();

    await profile__padla__getMenu();
    await profile__padla__exit();
    await profile__padla__getChats();
    await profile__padla__getGroup();
    await profile__padla__getInfo();

    await cron__start(21);
    await profile__checkNFT();

    await devtest();
    await clearButton();

    await profile__padla__channel__checker();
    // await profile__padla__startcall();

    await bot.launch().then(() => {
        Logger.Warn(Logger.Mode.SERVER, "Приложение успешно запущено");
    });
})();
