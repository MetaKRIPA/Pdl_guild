const User = require('../../models/user')

const home = (app, getUsersNftSIMPLE) => {

    app.get('/about', async (req, res) => {
        const usersNft = await getUsersNftSIMPLE()
        if (usersNft?.error) return res.render('pages/error', {error: usersNft.error})

        const usersInBot = (await User.find())?.length

        res.render('pages/about', {
            ...usersNft,
            usersInBot,
        })
    })
}
module.exports = home