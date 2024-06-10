const express = require('express')
const app = express()
const cron = require('node-cron');
const axios = require("axios")
const session = require('express-session')
const TonWeb = require('tonweb')
const {mnemonicToKeyPair} = require('tonweb-mnemonic')
const path = require('path');
const Address = TonWeb.utils.Address
let API_KEY = 'da5685dbfbb81f5116ab3a0bd6fe5fe7ddba34c4dbb05c1778f972fc7b5f46a1' // ------------api-key-for-mainNet-----------//
// let API_KEY = 'ee9cee5f71d64d840628e829ca3c67086f2729614ecdee2f08d58b2fc76bb39c' // ------------api-key-for-testNet-----------//
const Tons = require("./models/checker");

const TON_PROVIDER = new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: API_KEY}) // ------------api-for-mainNet-----------//
// const TON_PROVIDER = new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {apiKey: API_KEY}) // ------------api-for-testNet-----------//
const TON = new TonWeb(TON_PROVIDER)

// const SENDER_WALLET_MNEMONIC = ["track", "sad", "disorder", "write", "mercy", "smoke", "coffee", "middle", "enable", "abstract", "mesh", "base", "emotion", "brother", "pave", "recipe", "worry", "now", "spare", "spy", "robot", "lounge", 'dry', "will"]  //24 words //testNet
const SENDER_WALLET_MNEMONIC = ["leader", "pen", "farm", "color", "expire", "dash", "empty", "jazz", "person", "approve", "catch", "trap", "argue", "recall", "access", "arch", "enhance", "chapter", "mechanic", "absurd", "assume", "bleak", 'echo', "tool"]  //24 words
// const SENDER_WALLET_ADDRESS = 'EQC5bBZ-YqyUBWBomuT6m9zMCC65lNs-tST2cXrCJn3nLl9S' //testNet
const SENDER_WALLET_ADDRESS = 'EQCIlC5nXfz29B8sJzt-rl7esZEnNKCU7Iwo8l7iJv7qvA44'

let TONS_FOR_PAYMENT = 0

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

        const TelegrafChecker = require("telegraf").Telegraf;
        const botChecker = new TelegrafChecker("5468684438:AAF4hEthcbMJ22jVWaWjWNliq-nan8dPTh8");

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
                        console.log((el.in_msg.value / 1000000000 ) + " TON > " + new Date(+(el.utime + '000')).toDateString());
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
            if(await Tons.find().length === 0){
                await new Tons({tons: 0}).save(async () => {
                    try {
                        Logger.Message(Logger.Mode.DATABASE, `Значения для ТОН создано (${TONS_FOR_PAYMENT})`);
                    } catch (e) {
                        Logger.Error(Logger.Mode.DATABASE, e.message)
                    }
                })
            }
            await Tons.updateOne({tons: TONS_FOR_PAYMENT, lastSend:DateTrandsctionForDB}).then(() => {
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

(async () => {
    await getRoyalty()
})()
const transfer = async (address, tons) => {
    // const DESTINATION_WALLET_ADDRESS = address
    const DESTINATION_WALLET_ADDRESS = address.toString(true, true, false, false);
    // const DESTINATION_WALLET_ADDRESS = 'EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC'
    const TONS_TO_SEND = tons.toFixed(5).toString()

    const keyPair = await mnemonicToKeyPair(SENDER_WALLET_MNEMONIC)
    const wallet = TON.wallet.create({address: SENDER_WALLET_ADDRESS, wc: 0})

    const seqno = await wallet.methods.seqno().call()
    const transfer = await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: DESTINATION_WALLET_ADDRESS,
        amount: TonWeb.utils.toNano(TONS_TO_SEND),
        seqno,
        payload: 'PADLA bear Special royalty',
        sendMode: 3,
    })

    const transfer_result = await transfer.send()
    return transfer_result
}

const getUsersNft = async (address, creator, payable) => {
    try {

        const serverSideKey = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiU2hhaWxnbyJdLCJleHAiOjE4MTI5Njg2MzksImlzcyI6IkB0b25hcGlfYm90IiwianRpIjoiT1ZGMlE2NVdES01YNFM3REtCMk5GR1dGIiwic3ViIjoidG9uYXBpIn0.YoeV6M5BWOOfRQnvU-FL1utkhD3lNoB772owWyXvOlAYVkMl6a9t9pDu3O6KZn8tNniRYjOieP3gV20FAr1yDg'
        const theUrl = 'https://tonapi.io/v1/nft/getItemsByCollectionAddress'
        const params = {account: address}

        const request = await axios.get(theUrl, {params})

        // const nfts = []
        let strNft = ''
        const nfts = await Promise.all(await request.data.nft_items.map(async el => {
            try {
                // console.log(el)
                const wallet = el.address
                if (wallet !== creator) {
                    return (el.address)
                }


                return wallet
            } catch (e) {
                console.log(e)
            }

        }))

        let size = 10;
        let subarray = [];
        for (let i = 0; i < Math.ceil(nfts.length / size); i++) {
            subarray[i] = nfts.slice((i * size), (i * size) + size);
        }
        let ownersOfNfts = []
        for await (const subarrayElement of subarray) {
            strNft = subarrayElement.join(',')
            const url = `https://tonapi.io/v1/nft/getItems?addresses=${strNft}`
            await axios(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + serverSideKey,

                },
            })
                .then(response => {
                    return response.data;
                }).then((data) => {
                    // console.log(data)
                    data.nft_items.forEach(obj=>{
                        if (obj.sale){
                            if (new Address(obj.sale.owner.address).toString(true, true, true) !== creator) {
                                ownersOfNfts.push(new Address(obj.sale.owner.address).toString(true, true, true))
                            }
                        }else{
                            if (new Address(obj.owner.address).toString(true, true, true) !== creator) {
                                ownersOfNfts.push(new Address(obj.owner.address).toString(true, true, true))
                            }
                        }

                    })
                })
                .catch(async (error) => {
                    Logger.Error(Logger.Mode.AXIOS, error.message);
                });
        }

        const nftsNumber = ownersOfNfts.length
        const nftInPersent = (100 / nftsNumber).toFixed(3)

        const owners = {}
        ownersOfNfts.forEach((a) => owners[a] = owners[a] + 1 || 1)
        Logger.Message(Logger.Mode.AXIOS, `Получен ответ об Sale NFT `);

        if (payable) {
            Object.keys(owners).forEach(el => {
                const number = owners[el]
                const inPersent = number * nftInPersent
                const tons = (TONS_FOR_PAYMENT * (number * inPersent)) / 100

                owners[el] = {
                    number,
                    inPersent,
                    tons
                }
            })
        }

        return {
            // nftsWithCreators,
            ownersOfNfts,
            nftsNumber,
            nftInPersent,
            owners,
        }
    } catch
        (error) {
        console.log(error);
        // console.log('error');
        return getUsersNft(address, creator, payable)
    }
}

const getUsersNftSPECIAL = async () => await getUsersNft(
    'EQAj4tc4lfF0MFdXM0VD8J14JA3-oFYsOFYpOiZdYgelV7_9', // address
    // '0:130f5b5f4466eb075db738ec6ef6bb1872de1683cf235df1ce9a3401f72ba94a', // creator
    'EQDzD1tfRGbrB123OOxu9rsYct4Wg88jXfHOmjQB9yupSiRI', /// FOR MAIN!!!!

    //'EQAAU0L1lqfUuQaF9ODlTuiu_rmbr2ESJ4s75C3SUlAkI-qr',
    //'0:1e0eb4841c468a5851966ee84b3273d0ccc4746aeee3b3711fd1078e5c04c5fa',
    true
)
const getUsersNftSIMPLE = async () => await getUsersNft(
    'EQB2sfg-U6XX0u-LAW-dC41P0UwfUzEeV-Zk4zeZNOSgm07_',
    'EQDzD1tfRGbrB123OOxu9rsYct4Wg88jXfHOmjQB9yupSiRI'
)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/views'));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: 'Keep it secret',
    name: 'uniqueSessionID',
    saveUninitialized: false
}))

app.post('/api/sendTon', async (req, res) => {
    const {owners} = await getUsersNftSPECIAL()
    const data = Object.keys(owners).map(el => ({wallet: el, ...owners[el]}))

    const result = []
    // !!!!!!!!!!!!-----------ВАЖЛИВО-------!!!!!!!!

    // await Check.updateOne({_id: '62e7c5b7daba5168bc7bccc3'}, {lastSend: new Date()}).then(() => {


    const sendTon = async (index = 0) => {
        if (index === data.length) return res.send(result)
        try {
            const pay = await transfer(data[index].wallet, data[index].tons)
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
    TONS_FOR_PAYMENT = 0
    await Tons.updateOne({tons: TONS_FOR_PAYMENT}).then(() => {
        try {
            console.log(`Новое значение TON вписано в БД`);
        } catch (e) {
            console.log(e.message)
        }

    });
})

app.get('/', async (req, res) => {
    const usersNft = await getUsersNftSPECIAL()

    // if (usersNft?.error) return res.render('pages/error', { error: usersNft.error })

    res.render('pages/index', {
        ...usersNft,
        totalCost: TONS_FOR_PAYMENT,
    })
})

app.get('/about', async (req, res) => {
    const usersNft = await getUsersNftSIMPLE()
    if (usersNft?.error) return res.render('pages/error', {error: usersNft.error})

    const usersInBot = (await User.find())?.length

    res.render('pages/about', {
        ...usersNft,
        usersInBot,
    })
})
module.exports = app
// app.listen(8080)