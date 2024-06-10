const axios = require("axios");

async function func(wallet, tgId){

    // REMOVE
    //wallet = "EQBeJYbyNkXyLzJC7787GFRuyjx6y3v19QUdPL_am2N0P-xM";
    //END

    //wallet = "EQCK1QOtiFKHZBZujSOiVN5g0QmQEJN3wFZ8qR6XMNvuVoDb";


    Logger.Message(Logger.Mode.AXIOS, `Считывание всех NFT ( ${tgId} )`);
    const url = `https://tonapi.io/v2/accounts/${wallet}/nfts`
    //const url = `https://tonapi.io/v1/nft/getNftForSale?account=${wallet}`
    return await axios(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            Logger.Message(Logger.Mode.AXIOS, `Получен ответ об NFT ( ${tgId} )` );
            return response.data;
        })
        .catch(async (error) => {
            //Logger.Error(Logger.Mode.AXIOS, error.message + ` ( ${tgId} )`);
            Logger.Warn(Logger.Mode.AXIOS, `Повторная отправка NFT запроса ( ${tgId} )`)
            console.log(wallet)
            console.log(tgId)
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    resolve(await func(wallet, tgId));
                }, 10000);
            });
        });
}

module.exports = func;
