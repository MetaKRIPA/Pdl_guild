const mongoose = require('mongoose');
const Schema = mongoose.Schema;

userSchema = new Schema( {
	telegram: String,
	status: String,
	wallet: String,
	nfts: Array,
	statusNFT: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});
User = mongoose.model('User', userSchema);

module.exports = User;