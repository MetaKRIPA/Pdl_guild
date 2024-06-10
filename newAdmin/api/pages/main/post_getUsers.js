const UserAdmin = require("../../../models/useradmin");

const User = require("../../../models/user")

module.exports = async function(app) {

    try {
        app.post('/getUsers', async function (req, res) {
            try {
                const users = await UserAdmin.find({token: req.session.token}) || [];
                if (users.length !== 0) {

                    const limit = req.body.limit || 10000;

                    const usersGeneral = await User.find().limit(limit).sort({createdAt: -1}) || [];

                    console.log(usersGeneral);

                    res.send(usersGeneral);
                } else res.redirect("/login");
            } catch (e) {
                Logger.Error(Logger.Mode.PAGE, e.message, __filename);
                res.send("ERROR");
            }

        });
    } catch (e) {
        return e;
    }
}
