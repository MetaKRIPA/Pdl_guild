const Markup = require("telegraf").Markup;
const isGroup = require("../isGroup");
const getId = require("../getId");
const checkGroup = require("./checkGroup");

module.exports = async function () {
    await bot.on('new_chat_members', async (ctx) => {
        try {

            if (!await isGroup(ctx)) return;

            if(!checkGroup(ctx.update.message.chat.id)) {

                //await ctx.reply("Все Падлам привет от бота");

                const data = await User.findOne({telegram: await getId(ctx)});

                if (!data) {
                    await bot.telegram.kickChatMember(ctx.update.message.chat.id, ctx.update.message.new_chat_member.id);
                    await new RemoveUser({telegram: ctx.update.message.chat.id}).save(async () => {
                        try {
                            Logger.Message(Logger.Mode.DATABASE, `Пользователя помечено как заблокированого ( ${user.telegram} )`);
                        } catch (e) {
                            Logger.Error(Logger.Mode.DATABASE, e.message)
                        }
                    })
                    Logger.Message(Logger.Mode.REMOVE, `Пользователь не авторизован. Чат: ${ctx.update.message.chat.id} | Пользователь: ${ctx.update.message.new_chat_member.id}`);
                    return;
                }
            }

            else{

                //https://imgur.com/38STu8X
                
                return await ctx.replyWithVideo('https://padla.qteam.digital/welcome.gif',
                    {
                        caption: `Привет ${ctx.update.message.new_chat_member.first_name}, ты на <b>PADLA</b> районе! 👹 Че как оно?\n\nЕсли хочешь узнать больше о проекте, жми "<b>ИНФА</b>"\n\nЕсли у тебя уже есть <b>PADLA NFT</b>, жми "<b>Гильдия</b>" и вступай в наши ряды 🤖\n\n<u>Ну, а если ты уже со всем ознакомился, но остались какие-то вопросы, то задавай их прямо здесь. И мы поможем тебе до конца во всём разобраться</u> 🤗`,
                        parse_mode: 'Html',
                        reply_markup: {
                            inline_keyboard: [
                                [ { text: "🔎 ИНФА", url: "https://t.me/PADLA_PROJECT/109" }, { text: "😎 ГИЛЬДИЯ", url: "https://t.me/padlanft_bot" } ],
                            ]
                        }
                    });


            }

        } catch (e) {
            Logger.Error(Logger.Mode.GROUP, e.message);
        }
    });

}