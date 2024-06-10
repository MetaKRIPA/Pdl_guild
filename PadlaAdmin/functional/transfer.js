const {mnemonicToKeyPair} = require("tonweb-mnemonic");
const TonWeb = require("tonweb");

// let API_KEY = 'da5685dbfbb81f5116ab3a0bd6fe5fe7ddba34c4dbb05c1778f972fc7b5f46a1' // ------------api-key-for-mainNet-----------//
let API_KEY = 'ee9cee5f71d64d840628e829ca3c67086f2729614ecdee2f08d58b2fc76bb39c' // ------------api-key-for-testNet-----------//

const TON_PROVIDER = new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {apiKey: API_KEY}) // ------------api-for-testNet-----------//
// const TON_PROVIDER = new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: API_KEY}) // ------------api-for-mainNet-----------//

const TON = new TonWeb(TON_PROVIDER)
const SENDER_WALLET_MNEMONIC = ["track", "sad", "disorder", "write", "mercy", "smoke", "coffee", "middle", "enable", "abstract", "mesh", "base", "emotion", "brother", "pave", "recipe", "worry", "now", "spare", "spy", "robot", "lounge", 'dry', "will"]  //24 words //testNet
// const SENDER_WALLET_MNEMONIC = ["leader", "pen", "farm", "color", "expire", "dash", "empty", "jazz", "person", "approve", "catch", "trap", "argue", "recall", "access", "arch", "enhance", "chapter", "mechanic", "absurd", "assume", "bleak", 'echo', "tool"]  //24 words
const SENDER_WALLET_ADDRESS = 'EQC5bBZ-YqyUBWBomuT6m9zMCC65lNs-tST2cXrCJn3nLl9S' //testNet
// const SENDER_WALLET_ADDRESS = 'EQCIlC5nXfz29B8sJzt-rl7esZEnNKCU7Iwo8l7iJv7qvA44'

const transfer = async (address, tons) => {
    // const DESTINATION_WALLET_ADDRESS = address
    const DESTINATION_WALLET_ADDRESS = address.toString(true, true, false, false);
    // const DESTINATION_WALLET_ADDRESS = 'EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC'
    const TONS_TO_SEND = tons.toFixed(5).toString()

    const keyPair = await mnemonicToKeyPair(SENDER_WALLET_MNEMONIC)
    const wallet = TON.wallet.create({address: SENDER_WALLET_ADDRESS, wc: 0})

    const seqno = await wallet.methods.seqno().call()
    const transfer = await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: DESTINATION_WALLET_ADDRESS,
        amount: TonWeb.utils.toNano(TONS_TO_SEND),
        seqno,
        payload: 'PADLA bear Special royalty',
        sendMode: 3,
    })

    const transfer_result = await transfer.send()
    return transfer_result
}


module.exports = transfer;