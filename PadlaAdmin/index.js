global.Logger = require("./Logger");
const mongoose = require('mongoose');
const adminPanelExpress = require('./server')

let MongoDBURI = '###';


mongoose.connect(MongoDBURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});


(async () => {
    const db = mongoose.connection;

    await db.on('error', console.error.bind(console, 'connection error:'));
    await db.once('open', () => {
        Logger.Warn(Logger.Mode.SERVER, "База данных успешно подключена");
    });

    adminPanelExpress.listen(8385)
})();
