const getId = require("./getId");

module.exports = async function(response, ctx){
    let check = false;
    let WalletAddress;
    for (let i = 0; i < response.result.length; i++) {
        if (response.result[i].in_msg.message === (await getId(ctx)).toString()) {
            check = true

            WalletAddress = response.result[i].in_msg.source
            //WalletAddress = response.result[i].in_msg.destination
            break;
        }
    }
    return {
        status: check,
        wallet: WalletAddress
    };
}