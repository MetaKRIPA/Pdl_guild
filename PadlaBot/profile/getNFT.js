const checkAllNFT = require("../checkAllNFT");

module.exports = async function (wallet, tgId) {
    try {
        Logger.Message(Logger.Mode.NFT, `Проверка NFT ( ${tgId} )`);
        const responseNft = await checkAllNFT(wallet, tgId)
        let arrBears = []

        responseNft.nft_items.forEach(nft => {
            if (nft.collection_address === '0:76b1f83e53a5d7d2ef8b016f9d0b8d4fd14c1f53311e57e664e3379934e4a09b') {
                arrBears.push(nft)
            }
        })
        let arrNft = []
        if (arrBears.length !== 0) {

            arrBears.forEach(nft => {
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