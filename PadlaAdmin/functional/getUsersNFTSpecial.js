const axios = require("axios");
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
                    data.nft_items.forEach(obj => {
                        if (obj.sale) {
                            if (new Address(obj.sale.owner.address).toString(true, true, true) !== creator) {
                                ownersOfNfts.push(new Address(obj.sale.owner.address).toString(true, true, true))
                            }
                        } else {
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

        let owners = {}
        ownersOfNfts.forEach((a) => owners[a] = owners[a] + 1 || 1)
        Logger.Message(Logger.Mode.AXIOS, `Получен ответ об Sale NFT `);
        // owners = {
        //     EQBIZ511PcNfISdQXRe5zpfzetarzbiizLHdCSflfu7z9JkV: 1,
        //     EQBIZ511PcNfISdQXRe5zpfzetarzbiizLHdCSflfu7z91kV: 3
        // }

        // console.log(owners)
        if (payable) {
            Object.keys(owners).forEach(el => {
                const number = owners[el]
                const inPersent = number * nftInPersent
                // console.log('TONS_FOR_PAYMENT', TONS_FOR_PAYMENT)
                // console.log('number', number)
                // console.log('inPersent', inPersent)
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

module.exports = {
    getUsersNftSPECIAL: getUsersNftSPECIAL,
    getUsersNftSIMPLE:getUsersNftSIMPLE
};