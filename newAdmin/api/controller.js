const getConfig = require("./general/get_config");
const getLogin = require("./pages/login/get_login");
const postAuthorization = require("./pages/login/post_authorization");
const getMainPage = require("./pages/main/get_mainPage");
const postGetUsersCounter = require("./pages/main/post_getUsersCounter");
const postGetNFTRoyalty = require("./pages/main/post_getNFTRoyalty");
const postGetUsers = require("./pages/main/post_getUsers");
const getUsersPage = require("./pages/users/get_usersPage");
const getPadlaTalkPage = require("./pages/padlaTalk/get_page");

module.exports = async function(app){

    await connectAPI(getConfig, "config");
    await connectAPI(getLogin, "getLogin");
    await connectAPI(postAuthorization, "postAuthorization");
    await connectAPI(getMainPage, "getMainPage");
    await connectAPI(postGetUsersCounter, "postGetUsersCounter");
    await connectAPI(postGetNFTRoyalty, "postGetNFTRoyalty");
    await connectAPI(postGetUsers, "postGetUsers");
    await connectAPI(getUsersPage, "getUsersPage");
    await connectAPI(getPadlaTalkPage, "getPadlaTalkPage");

    async function connectAPI(api, title){
        try {
            const connect = await api(app);
            if(!connect){ Logger.API(title) }
            else { throw new Error(connect.message) }
        }catch (e) { Logger.API(title, e) }
    }
}