const getNFT = require("../profile/getNFT");
const getSaleNFT = require("../profile/getSaleNFT");
const checkStatus = require("./checkStatus");

async function func(arrUser, counter) {
    try {
        if(counter === 0) return;

        const user = arrUser[counter-1];

        Logger.Message(Logger.Mode.CRON, "Проверка пользователя: " + user.telegram);

        const _getNFT = await getNFT(user.wallet, user.telegram);
        const _getSaleNFT = await getSaleNFT(user.wallet, user.telegram);
        const arrNft = _getNFT.concat(_getSaleNFT);

        Logger.Message(Logger.Mode.CRON, `Обнаружено ${arrNft.length} NFT ( ${user.telegram} )`);

        if(arrNft.length === 0){
            await checkStatus(user);
        }else{
            await User.updateOne({telegram: user.telegram}, {nfts: arrNft, statusNFT: true}).then(() => {
                Logger.Message(Logger.Mode.DATABASE, `Обновлено количество NFT ( ${user.telegram} )`);
            });
        }

        await func(arrUser, counter-1);
    }catch (e) {
        Logger.Error(Logger.Mode.CRON, e.message + ` ( ${arrUser[counter-1].telegram} )`)
    }
}

module.exports = func;