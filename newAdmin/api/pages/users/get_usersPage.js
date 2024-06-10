const UserAdmin = require("../../../models/useradmin");

module.exports = async function(app){

    try {
        app.get('/users', async function (req, res) {
            try {
                const users = await UserAdmin.find({token:req.session.token}) || [];
                if(users.length !== 0) res.render("users");
                else res.redirect("/login");
            }catch (e) {
                Logger.Error(Logger.Mode.PAGE, e.message, __filename);
                res.send("ERROR");
            }

        });
    }catch (e) { return e; }




}