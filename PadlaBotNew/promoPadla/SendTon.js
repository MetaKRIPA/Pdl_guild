const { WalletContractV4,TonClient, internal } = require("@ton/ton");

const {mnemonicToWalletKey} = require("ton-crypto");

const dotenv = require('dotenv');
dotenv.config()
// require('dotenv').config(); // ES6

const mainnet = true

module.exports = async (checkedWalletAddress, amount, message) => {
    try {
        const jsonRPC = mainnet ? 'https://toncenter.com/api/v2/jsonRPC' : 'https://testnet.toncenter.com/api/v2/jsonRPC'
        const apiKey = mainnet ? 'da5685dbfbb81f5116ab3a0bd6fe5fe7ddba34c4dbb05c1778f972fc7b5f46a1' : 'ee9cee5f71d64d840628e829ca3c67086f2729614ecdee2f08d58b2fc76bb39c'
        const mnemonicPhrase = mainnet ? "north pond poet soul raven humor boost inside pulp enlist reward stone thing loud save miracle hub cross blouse between thrive escape exhaust mixture".split(" ") : "axis melt valley file next behave foot safe twelve around panther omit faint april error cabin couple secret ancient clever disorder budget remove achieve"
        const client = new TonClient({
            endpoint: jsonRPC,
            apiKey: apiKey
        });

        let keyPair = await mnemonicToWalletKey(mnemonicPhrase)
        let workchain = 0;
        let wallet = WalletContractV4.create({workchain, publicKey: keyPair.publicKey});
        let contract = client.open(wallet);

        let balance = await contract.getBalance();

        let seqno = await contract.getSeqno();
        if (Number(balance) / 1000000000 <= amount){
            Logger.Error(Logger.Mode.TON, 'Amount bigger that balance!' + ` (${checkedWalletAddress} -> ${amount})`);
            return false;
        }

        // create body transfer
        let transfer = await contract.createTransfer({
            seqno,
            secretKey: keyPair.secretKey,
            messages: [internal({
                value: amount * 1000000000,
                to: checkedWalletAddress,
                body: message,
            })]
        });
        if (!transfer){
            Logger.Error(Logger.Mode.TON, 'Tx not created!' + ` (${checkedWalletAddress} -> ${amount})`);
            return false;
        }

        // send transef to blockchain
        await contract.send(transfer)
        Logger.Message(Logger.Mode.TON, 'Transaction successfully send to blockchain' + ` (${checkedWalletAddress} -> ${amount})`);
        return true;
    } catch (e) {
        Logger.Error(Logger.Mode.TON, e.message);
        return false;
    }
}
//sendTON('EQBIZPulTo03pdxBnIoURKOCWl5onv77oWReo9xCfFWCcnrS', 0.1, 'PADLA WAS COMING!') //Just for inline testing
