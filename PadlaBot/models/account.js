import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let accountSchema = new Schema( {
    telegramID: Number,
    WalletAddress: String,
    NFT: Array,
    updateAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Account = mongoose.model('Account', accountSchema);

export const Account = mongoose.model('Account', accountSchema);