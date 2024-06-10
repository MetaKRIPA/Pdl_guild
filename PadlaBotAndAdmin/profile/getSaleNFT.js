const checkAllSaleNFT = require("../checkAllSaleNFT");

module.exports = async function (wallet, tgId) {
    try {
        Logger.Message(Logger.Mode.NFT, `Проверка Sale NFT ( ${tgId} )`);
        const responseNft = await checkAllSaleNFT(wallet, tgId)
        let arrBearsSale = [];

        if(!responseNft.getgems) return [];

        responseNft.getgems.forEach(elem => {
            if (elem.nft.collection_address === '0:76b1f83e53a5d7d2ef8b016f9d0b8d4fd14c1f53311e57e664e3379934e4a09b') {
                arrBearsSale.push(elem.nft)
            }
        })
        let arrNft = []
        if (arrBearsSale.length !== 0) {

            arrBearsSale.forEach(nft => {
                arrNft.push(nft.address)
            })

            return arrNft;

        } else {
            return [];
        }

    } catch (e) {
        Logger.Error(Logger.Mode.NFT, e.message + ` ( ${tgId} )`);
        return false;
    }
}