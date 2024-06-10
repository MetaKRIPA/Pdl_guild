
const setTons = (app) => {

    app.post('/api/login', async (req, res) => {
        try {
            // req.session.login = 'workHard'
            req.session.login = req.body.login
            res.send({response:'Новое значение TON вписано в БД'})
        }catch (e) {
            console.log(e)
        }
    })
    app.post('/api/exit', async (req, res) => {
        try {
            req.session.login = ''
            res.send({response:'Новое значение TON вписано в БД'})
        }catch (e) {
            console.log(e)
        }
    })

}
module.exports = setTons