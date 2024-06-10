const Tons = require('../../models/checker')

const home = (app, getUsersNftSPECIAL) => {

    app.get('/', async (req, res) => {
        // req.session.views = 0
        if (req.session.login === 'EQDcf25Yb_U3GHGk0R2LXB4F3lVFhVThrHDRBveyKPyCIH-r'){

            // console.log(req.session.login)
            const usersNft = await getUsersNftSPECIAL()
            const tons = await Tons.findOne()
            // console.log(tons)
            if (usersNft?.error) return res.render('pages/error', {error: usersNft.error})
            // console.log((owners[key].tons / owners[key].number).toFixed(3))
            res.render('pages/index', {
                ...usersNft,
                totalCost: tons.tons,
            })
        }else {
            res.render('pages/login')
        }
    })

}
module.exports = home
