const UserAdmin = require("./models/useradmin");

module.exports = async function(){
    try {
        const users = await UserAdmin.find() || [];
        if(users.length === 0){
            await new UserAdmin({token:"EQDcf25Yb_U3GHGk0R2LXB4F3lVFhVThrHDRBveyKPyCIH-r"}).save().then(() => {
                Logger.Message(Logger.Mode.DEFAULT, "Initial user created with token: EQDcf25Yb_U3GHGk0R2LXB4F3lVFhVThrHDRBveyKPyCIH-r")
            });
        }
    }catch (e){
        Logger.Error(Logger.Mode.DEFAULT, e.message);
    }
}