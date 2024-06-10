const axios = require("axios");

async function func(tgId){

    Logger.Message(Logger.Mode.AXIOS, `Проверка оплаты ( ${tgId} )`);

    const url = `https://toncenter.com/api/v2/getTransactions?address=${global.Settings.wallet}&limit=100 &to_lt=0&archival=false`
    return await axios(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            Logger.Message(Logger.Mode.AXIOS, `Получен ответ об оплате ( ${tgId} )` );
            return response.data;
        })
        .catch(async (error) => {
            //Logger.Error(Logger.Mode.AXIOS, error.message + ` ( ${tgId} )`);
            Logger.Warn(Logger.Mode.AXIOS, `Повторная отправка запроса ( ${tgId} )`)
            return new Promise((resolve, reject) => {
                try {
                    setTimeout(async () => {
                        try {
                            resolve(await func(tgId));
                        }catch (e) {
                            Logger.Warn(Logger.Mode.AXIOS, e.message);
                        }
                    }, 1000);
                }catch (e) {
                    Logger.Warn(Logger.Mode.AXIOS, e.message);
                }
            });
        });
}

module.exports = func;