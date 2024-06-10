const path = require("path");
const express = require("express");
const session = require("express-session");
const home = require("./get/home");
const about = require("./get/about");
const setTons = require("./post/setTons");
const sendTon = require("./post/sendTon");
const login = require("./post/login");
let TONS_FOR_PAYMENT = 0

const connectApp = (app, getUsersNftSPECIAL, getUsersNftSIMPLE) => {

    app.set('../views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs')

    app.use(express.static(__dirname + '/views'));

    app.use(express.json({}))
    app.use(express.urlencoded({extended: true}))

    app.use(session({
        secret: 'Keep it secret',
        name: 'uniqueSessionID',
        saveUninitialized: false
    }))

    login(app)
    setTons(app)
    sendTon(app, getUsersNftSPECIAL, TONS_FOR_PAYMENT)
    home(app, getUsersNftSPECIAL, TONS_FOR_PAYMENT)
    about(app, getUsersNftSIMPLE)

}
module.exports = connectApp
