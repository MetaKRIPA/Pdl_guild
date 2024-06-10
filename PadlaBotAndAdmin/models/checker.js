const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

let tonsSchema = new Schema( {
    // telegramID: Number,
    // WalletAddress: String,
    // NFT: Array,
    tons: Number,
    lastSend: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Tons = mongoose.model('Tons', tonsSchema);

module.exports = Tons;
