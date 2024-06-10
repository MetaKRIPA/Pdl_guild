const UserAdmin = require("../../../models/useradmin");

const User = require("../../../models/user")

module.exports = async function(app) {

    try {
        app.post('/getUsersCounter', async function (req, res) {
            try {
                const users = await UserAdmin.find({token: req.session.token}) || [];
                if (users.length !== 0) {
                    const usersP = await User.find() || [];

                    let counterNewUser = 0;

                    usersP.forEach(e => {
                        if(new Date(e.createdAt).getDate() === new Date().getDate() &&
                            new Date(e.createdAt).getMonth() === new Date().getMonth() &&
                            new Date(e.createdAt).getFullYear() === new Date().getFullYear()) counterNewUser++;
                    });

                    res.send({
                        allUser: usersP.length,
                        newUser: counterNewUser
                    });
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
