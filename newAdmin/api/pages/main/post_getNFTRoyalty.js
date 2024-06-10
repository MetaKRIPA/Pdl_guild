const UserAdmin = require("../../../models/useradmin");
const Tons = require("../../../models/checker");

module.exports = async function(app) {

    try {
        app.post('/getNFTRoyalty', async function (req, res) {
            try {

                const users = await UserAdmin.find({token: req.session.token}) || [];
                if (users.length !== 0) {
                    const data = await Tons.find() || [];
                    res.send((data[0].tons).toString());
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
