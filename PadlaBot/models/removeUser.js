const mongoose = require('mongoose');
const Schema = mongoose.Schema;

removeUserSchema = new Schema( {
    telegram: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
removeUser = mongoose.model('removeUser', removeUserSchema);

module.exports = removeUser;