const config = require("./../../config")();

module.exports = async function(app){

    try {
        app.get('/config', function (req, res) {
            res.send(config);
        });
    }catch (e) { return e; }

}