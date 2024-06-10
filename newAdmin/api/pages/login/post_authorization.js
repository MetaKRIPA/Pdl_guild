const UserAdmin = require("../../../models/useradmin");

module.exports = async function(app){

    try {
        app.post('/authorization', async function (req, res) {
            try {
                const users = await UserAdmin.find({token:req.body.token}) || [];
                if(users.length !== 0){
                    req.session.token = req.body.token;
                    res.send(true);
                }else{
                    res.send(false);
                }
            }catch (e) {
                Logger.Error(Logger.Mode.PAGE, e.message, __filename);
                res.send("ERROR");
            }

        });
    }catch (e) { return e; }




}