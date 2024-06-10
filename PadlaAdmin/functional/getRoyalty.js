const Tons = require("../models/checker");
const axios = require("axios");
const getRoyalty = async (previous) => {
    try {

        let API_KEY2 = 'da5685dbfbb81f5116ab3a0bd6fe5fe7ddba34c4dbb05c1778f972fc7b5f46a1'
        const url = 'https://toncenter.com/api/v2/getTransactions'
        const params = {
            address: 'EQDzD1tfRGbrB123OOxu9rsYct4Wg88jXfHOmjQB9yupSiRI',
            limit: 500,
            api_key: API_KEY2
        };
        const TonsFromBD = (await Tons.findOne())
        TONS_FOR_PAYMENT = TonsFromBD.tons
        TONS_LAST_TRANSACTION = TonsFromBD.lastSend || (new Date()).setDate(new Date().getDate() - 100000);

        console.log(TonsFromBD);

        // const TelegrafChecker = require("telegraf").Telegraf;
        // const botChecker = new TelegrafChecker("5468684438:AAF4hEthcbMJ22jVWaWjWNliq-nan8dPTh8");

        // cron.schedule('*/10 * * * * *', async () => {

        //setInterval(async () => {
        //cron.schedule('0 5 * * * *', async () => {
        Logger.Message(Logger.Mode.CRON, "Запущена крона для админки");
        const request = await axios.get(url, {params})
        let arr = [];

        const reqData = request.data.result.reverse() || [];

        let DateTrandsctionForDB = TonsFromBD.lastSend;

        //await Tons.updateOne({tons: 0, lastSend:null});
        //return;

        reqData.forEach((el, index) => {
            try {

                // проверка на диапазон цен и на пустой коментарий

                if (el.in_msg.value > 0.54 * 1000000000 && 8 * 1000000000 > el.in_msg.value /*&& !el.in_msg.message*/) {


                    let date = new Date();
                    console.log((el.in_msg.value / 1000000000) + " TON > " + new Date(+(el.utime + '000')).toDateString());
                    date.setDate(date.getDate() - 1);

                    console.log("trans: " + new Date(+(el.utime + '000')));
                    console.log("databs: " + new Date(TONS_LAST_TRANSACTION));
                    console.log(new Date(+(el.utime + '000')) > new Date(TONS_LAST_TRANSACTION))


                    if (new Date(+(el.utime + '000')) > new Date(TONS_LAST_TRANSACTION)) {
                        TONS_FOR_PAYMENT += +((+el.in_msg.value / 1000000000) / 2);
                        DateTrandsctionForDB = new Date(+(el.utime + '000'));
                    }
                }
            } catch (e) {
                console.log(e)
            }

        })
        TONS_FOR_PAYMENT = +TONS_FOR_PAYMENT?.toFixed(3) || +TONS_FOR_PAYMENT
        if (await Tons.find().length === 0) {
            await new Tons({tons: 0}).save(async () => {
                try {
                    Logger.Message(Logger.Mode.DATABASE, `Значения для ТОН создано (${TONS_FOR_PAYMENT})`);
                } catch (e) {
                    Logger.Error(Logger.Mode.DATABASE, e.message)
                }
            })
        }
        await Tons.updateOne({tons: TONS_FOR_PAYMENT, lastSend: DateTrandsctionForDB}).then(() => {
            try {
                Logger.Message(Logger.Mode.SERVER, `Значения тон обновлено, сейчас значения: ${TONS_FOR_PAYMENT}`);
                botChecker.telegram.sendMessage(-786484496, "Значения TON оновлено. Текущее значение: " + TONS_FOR_PAYMENT);
                console.log("Значения TON оновлено. Текущее значение: " + TONS_FOR_PAYMENT);
            } catch (e) {
                console.log(e.message)
            }

        });


        //}, 1000 * 60 * 60 * 24);

    } catch (e) {
        console.log(e)
    }
}


module.exports = getRoyalty;