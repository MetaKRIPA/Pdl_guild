const mongoose = require('mongoose');
const User = require('../../models/user');
const Telegraf = require('telegraf').Telegraf;
const fs = require('fs');
const { LocalStorage } = require('node-localstorage');

console.log('process.argv', process.argv);

const userId = process.argv[2];
console.log('userId', userId);

const fileLocalStorage = `/home/PADLA/PadlaBotNew/profile/tonkeeper/localstorage/${userId}`;
fs.rmSync(fileLocalStorage, {
    recursive: true,
    force: true
});
global.window = {
    localStorage: new LocalStorage(fileLocalStorage)
};



const app = new Telegraf('5550932029:AAFmb6fvkRl4kL_5Dl5z0dKhUy9Q0mDEUyY');

(async () => {

    try {
        const { TonConnect } = require('@tonconnect/sdk');

        const connectorTonConnect = new TonConnect({ manifestUrl: 'https://padla.qteam.digital/manifest.json', storage: global.window.localStorage });
        console.log('connectorTonConnect', connectorTonConnect);
        await connectorTonConnect.restoreConnection();
        console.log('connectorTonConnect', connectorTonConnect);

        connectorTonConnect.onStatusChange(
            async walletInfo => {
                await mongoose.connect('mongodb://superAdmin:FBiDIZaDm7wIsLCD@127.0.0.1:27017/PADLA?authSource=admin');

                const tonProof = walletInfo.connectItems.tonProof;
                const generalId = tonProof?.proof?.payload;

                const dataUser = await User.findOne({ telegram: generalId });
                if(!dataUser) return

                if (dataUser?.wallet) {
                    await app.telegram.sendMessage(generalId, `Ты уже авторизован`, {
                        parse_mode: 'HTML'
                    });
                    return;
                }

                const wallet = walletInfo.account.address;

                const checkWallet = await User.findOne({ wallet }) || null;
                if (checkWallet) {
                    console.log('checkWallet', checkWallet);
                    await app.telegram.sendMessage(generalId, `👮‍ <b>Адрес кошелька</b>, который вы хотите использовать, <b>уже авторизован❗️</b>`, {
                        parse_mode: 'HTML'
                    });
                    await User.deleteOne({ telegram: generalId });
                    return;
                }
                await User.findOneAndUpdate({ telegram: generalId }, { wallet });

                await app.telegram.sendMessage(generalId, `Ура, теперь ты <b>PADLA</b>. \n` +
                                    `Добро пожаловать в Гильдию 🤗`, {parse_mode: 'HTML'})
                process.exit(0);
            }
        );

        const walletsList = await connectorTonConnect.getWallets();

        let res = connectorTonConnect.connect({
            universalLink: walletsList[0].universalLink,
            bridgeUrl: walletsList[0].bridgeUrl,

        }, { tonProof: userId.toString() });

        await app.telegram.sendMessage(userId, `Требуется авторизация`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: '💎 Авторизация',
                        url: res
                    }]
                ]
            }
        });
    } catch (e) {
        console.log(e.message);
    }

})();
