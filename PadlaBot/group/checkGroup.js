module.exports = function (id) {

    try {

        let status = true;

        global.Channel.forEach(elem => { if(elem.id === id) status = false; });
        global.Chats.forEach(elem => { if(elem.id === id) status = false; });
        
        return status;

    } catch (e) {
        Logger.Error(Logger.Mode.GROUP, e.message);
    }


}