const axios = require("axios");

async function func(wallet, tgId){

    // REMOVE
    //wallet = "EQCK1QOtiFKHZBZujSOiVN5g0QmQEJN3wFZ8qR6XMNvuVoDb";
    //END

    Logger.Message(Logger.Mode.AXIOS, `Считывание всех Sale NFT ( ${tgId} )`);
    const url = `https://tonapi.io/v1/nft/getNftForSale?account=${wallet}`
    return await axios(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            Logger.Message(Logger.Mode.AXIOS, `Получен ответ об Sale NFT ( ${tgId} )` );
            return response.data;
        })
        .catch(async (error) => {
            //Logger.Error(Logger.Mode.AXIOS, error.message + ` ( ${tgId} )`);
            Logger.Warn(Logger.Mode.AXIOS, `Повторная отправка Sale NFT запроса ( ${tgId} )`)
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    resolve(await func(wallet, tgId));
                }, 1000 * 10);
            });
        });
}

module.exports = func;