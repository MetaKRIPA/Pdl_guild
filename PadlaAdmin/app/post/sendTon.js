const Tons = require("../../models/checker");
const transfer = require("../../functional/transfer");

const sendTon = (app, getUsersNftSPECIAL, TONS_FOR_PAYMENT) => {

    app.post('/api/sendTon', async (req, res) => {
        const {owners} = await getUsersNftSPECIAL()
        const data = Object.keys(owners).map(el => ({wallet: el, ...owners[el]}))

        const result = []
        // !!!!!!!!!!!!-----------ВАЖЛИВО-------!!!!!!!!

        // await Check.updateOne({_id: '62e7c5b7daba5168bc7bccc3'}, {lastSend: new Date()}).then(() => {


        const sendTon = async (index = 0) => {
            if (index === data.length) return res.send(result)
            try {
                const tons = await Tons.findOne()
                const pay = await transfer(data[index].wallet, +(((tons.tons * data[index].inPersent.toFixed(3))/100)/2).toFixed(3))
                result.push({
                    success: !!pay,
                    wallet: data[index].wallet
                })

                if (!pay) console.log("Оплата не прошла по адресу:", data[index].wallet, "с таким количеством ТОН", data[index].tons)

                setTimeout(() => {
                    sendTon(index + 1)
                }, 10000)
            } catch (e) {
                console.log(e)
                console.log("Оплата не прошла по адресу:", data[index].wallet, "с таким количеством ТОН", data[index].tons)

                setTimeout(() => {
                    sendTon(index)
                }, 10000)
            }
        }

        await sendTon()
        // TONS_FOR_PAYMENT = 0
        await Tons.updateOne({tons: 0}).then(() => {
            try {
                console.log(`Новое значение TON вписано в БД`);
            } catch (e) {
                console.log(e.message)
            }

        });
    })


}
module.exports = sendTon