const Tons = require('../../models/checker')

const setTons = (app) => {

    app.post('/api/setTONS', async (req, res) => {
        try {
            const tons = await Tons.findOne({})
            let number = (tons.tons +  +req.body.tons).toFixed(3)
            await Tons.updateOne({tons: +number}).then(() => {
                try {
                    console.log(`Новое значение TON вписано в БД`);
                } catch (e) {
                    console.log(e.message)
                }
            });
            res.send({response:'Новое значение TON вписано в БД'})
        }catch (e) {
            console.log(e)
        }
    })

}
module.exports = setTons
