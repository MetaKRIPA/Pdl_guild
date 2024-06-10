const promoPadla = require("./index");

module.exports = async function(){
    bot.action(/promo_buttonAvatar__.+/, async (ctx) => {
        try {
            await promoPadla();
            const callbackData = ctx.match[0];
            const parts = callbackData.split('__');
            const data = parts[1];
            const dataFilter = data.split("!");
            const id = dataFilter[0];
            const username = dataFilter[1];

            await ctx.editMessageText(`🤖 Участник @${username} ( ${id} ) был выбран для получения награды.\n\n <b>[ ❌ Ава ]</b>`, {
                parse_mode: 'HTML',
            });

            await bot.telegram.sendMessage(id, `☝️ <b>Удача любит тех, кто в нее верит.</b>\n\nТолько что ты упустил(а) свой шанс залутать халявные тончики, просто за то что ты ПАДЛА 👹\n\n<span class="tg-spoiler">❗️ <b>Больше не упускай такую возможность</b></span>\n\nДля участия в <b>PADLA PROMO</b> достаточно выполнить два условия:\n❌ Поставить Падлу на Аву\n✅ Иметь в био ссылку на <a href="https://t.me/padla_chat">чат</a> или <a href="https://t.me/padla_project">канал</a> Падл. `, { parse_mode: 'HTML'});

        }catch (e) {
            Logger.Error(Logger.Mode.PROMO, e.message)
        }
    });
}