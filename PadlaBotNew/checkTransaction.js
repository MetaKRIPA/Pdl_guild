const axios = require("axios");

async function func(tgId){

    Logger.Message(Logger.Mode.AXIOS, `Проверка оплаты ( ${tgId} )`);

    const url = `https://apilist.tronscanapi.com/api/accountv2?address=${global.Settings.wallet}`;
    console.log(url);
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
            console.log(error.message);
            //Logger.Error(Logger.Mode.AXIOS, error.message + ` ( ${tgId} )`);
            try {
                Logger.Warn(Logger.Mode.AXIOS, `Повторная отправка запроса ( ${tgId} )`)
                return new Promise((resolve, reject) => {
                    try {
                        setTimeout(async () => {
                            try {
                                resolve(await func(tgId));
                            }catch (e) {
                                Logger.Warn(Logger.Mode.AXIOS, e.message);
                            }
                        }, 5000);
                    }catch (e) {
                        Logger.Warn(Logger.Mode.AXIOS, e.message);
                    }
                });
            }catch (e) {
                Logger.Error(Logger.Mode.AXIOS, `Повторная отправка запроса не удалась ( ${tgId} )`)
                return null;
            }


        });
}

module.exports = func;