const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

let tonsSchema = new Schema( {
    tons: Number,
    lastSend: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Tons = mongoose.model('Tons', tonsSchema);

module.exports = Tons;
