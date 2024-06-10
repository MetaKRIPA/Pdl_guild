// const {StringSession} = require("telegram/sessions");
// const {TelegramClient, Api} = require("telegram");
// const input = require("input");
const { Api,TelegramClient } = require ("telegram");
const { StringSession } = require ("telegram/sessions");
const input = require ("input");

const apiId = 11164175;
const apiHash = "c243183b9ea4981544519c8fe068b0cc";
const stringSession = new StringSession("");

module.exports = async function () {
    // fill this later with the value from session.save()
    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
            await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again
    const a = await client.sendMessage("me", { message: "Hello!" });
    console.log(a)
    let aa = 0
    await bot.command('startcall', async (ctx) => {
        try {
                aa++
                const result = await client.invoke(
                    new Api.phone.CreateGroupCall({
                        peer: -1001226594650,
                        // peer: -861131555,
                        randomId: aa,
                        title: "PADLA ЧАТ",
                        scheduleDate: 0,
                    })
                );
                console.log(result); // prints the result


//  +380951059581

        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message);
        }


    })
}