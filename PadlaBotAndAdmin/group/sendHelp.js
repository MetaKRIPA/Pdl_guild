const Markup = require("telegraf").Markup;
const isGroup = require("../isGroup");

const arrCheckHelp = [];

module.exports = async function () {
    await bot.help(async (ctx) => {
        try {

            const tgID = ctx.update.message.from.id;

            if(arrCheckHelp.indexOf(tgID) !== -1) return;

            arrCheckHelp.push(tgID);

            setTimeout(() => {
                var myIndex = arrCheckHelp.indexOf(tgID);
                if (myIndex !== -1) {
                    arrCheckHelp.splice(myIndex, 1);
                }
            }, 10 * 1000);

            if (!await isGroup(ctx)) return;

            Logger.Message(Logger.Mode.GROUP,
                `Вызвана команда /help ( ${ctx.update.message.from.id} )`);

            return await ctx.replyWithPhoto('https://tgbot.qteam.digital/padla/padlahelp.jpg',
                {
                    caption: `Медвежата, для вашего удобства, мы собрали все нужные ссылки в одном посте.

🔘 White paper здесь 👉 <a href="https://telegra.ph/WHITE-PAPER-PADLA-BEAR-04-24">пуньк</a>
🔘 Сайт тут 👉 <a href="http://padlabear.tilda.ws/">клац</a>
🔘 Коллекция "PADLA BEAR"👉 <a href="https://getgems.io/collection/EQB2sfg-U6XX0u-LAW-dC41P0UwfUzEeV-Zk4zeZNOSgm07_">чпоньк</a>
🔘 Вступить в Гильдию 👉 <a href="https://t.me/padlanft_bot">чик</a>
🔘 Как создать отдельные папки в ТГ для чатов/каналов 👉 <a href="https://t.me/PADLA_PROJECT/113">клэнц</a>

🔘 Как купить 👉 <a href="https://telegra.ph/Kak-kupit-padlu-05-08">тыц</a> 
🔘 Бонусы 👉  <a href="https://telegra.ph/Bonusy-05-10">чпок</a>`,
                    parse_mode: 'Html'
                });
        } catch (e) {
            Logger.Error(Logger.Mode.GROUP, e.message);
        }
    });

}