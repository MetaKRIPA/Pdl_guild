const Markup = require("telegraf").Markup;
const getId = require("../getId");
const isGroup = require("../isGroup");

module.exports = async function () {

    bot.hears('Авторизация', async (ctx) => {
        try {
            if (await isGroup(ctx)) return;

            const dbData = await User.findOne({telegram: await getId(ctx)});
            if(dbData) return;

            const sendText = 'Для авторизации необходимо подключить свой кошелёк на котором находятся PADLA NFT. \n' +
                '\n' +
                'Переведи (0.001 TON) на этот кошелёк:\n' +
                '<code>'+global.Settings.wallet+'</code>\n' +
                '\n' +
                'С комментарием: <code>'+await getId(ctx)+'</code>\n' +
                '\n' +
                'Или можете просто перейти по <a href="ton://transfer/' + global.Settings.wallet + '?amount=1000000&amp;text=' + await getId(ctx) + '">ссылке для оплаты</a> и у вас все поля будут заполнены автоматически.' +
                '\n' +
                '\n' +
                '<b>PS: Комментарий обязателен, иначе авторизация не пройдёт.</b> \n' +
                '\n' +
                '<u>Если вы уже совершали оплату раннее с вашего кошелька, но по какой-то причине вышли из своего аккаунта, просто нажмите "Оплатил"</u>';

            await ctx.reply(sendText, {
                reply_markup: 'markdown',
                parse_mode: 'Html',
                ...Markup.keyboard([
                    'Оплатил'
                ]).resize()
            })
        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message);
        }
    });

}