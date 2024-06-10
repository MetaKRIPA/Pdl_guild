const express = require('express');
const config = require("./config")();

const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');


const api = require("./api/controller");
const defaultData = require("./defaultData");

global.Logger = require("./Logger");

(async () => {
    const app = express();

    app.set('view engine', 'ejs');

    const mongoUrl = 'mongodb://localhost/PADLA';

    mongoose.connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => { Logger.Warn(Logger.Mode.DATABASE, 'Connection has been established successfully')})
    .catch((err) => { Logger.Error(Logger.Mode.DATABASE, err.message); });


    app.use(session({
        secret: 'sessionsPadlaSecret',
        resave: true,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl,
        })
    }));

    app.use(express.static(__dirname + '/views'))

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    await api(app);

    app.use((req, res, next) => {
        Logger.Warn(Logger.Mode.PAGE, "Don't found: " + req.url);
        res.render("404");

    });

    await defaultData();

    await app.listen(config.port, function () {
        Logger.Warn(Logger.Mode.SERVER, "App listening at port " + config.port);
    })
})();
