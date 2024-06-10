// const {StringSession} = require("telegram/sessions");
// const {TelegramClient, Api} = require("telegram");
// const input = require("input");
const { Api,TelegramClient } = require ("telegram");
const { StringSession } = require ("telegram/sessions");
const input = require ("input");
const getId = require("../../getId");

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
                const id = ctx.update.message.chat.id;
                // 136817688 - ☯ℙ𝔻𝕃☯RAID chat 👹 | -1001710030828
                let callId = 0;
                switch (id){
                    case -1001768172055:
                        callId = -1001590617433
                        break;
                    case -1001442231013:
                        callId = -1001698597230
                        break;
                    case -1001676207940:
                        callId = -1001710030828
                        break;

                }

                if(callId === 0) return;
                console.log(id);
                console.log(callId);
                aa++
                const result = await client.invoke(
                    new Api.phone.CreateGroupCall({
                        peer: callId,
                        // peer: -861131555,
                        randomId: aa,
                        title: "PADLA ЧАТ",
                        scheduleDate: 0,
                    })
                );
                console.log(result);

//  +380951059581

        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message);
        }


    })
}