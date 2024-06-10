const mongoose = require('mongoose');
const Schema = mongoose.Schema;

userSchema = new Schema( {
	token: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
});
UserAdmin = mongoose.model('UserAdmin', userSchema);

module.exports = UserAdmin;