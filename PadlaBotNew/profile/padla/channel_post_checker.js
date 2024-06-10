
module.exports = async function () {
    await bot.on('channel_post', async (ctx) => {
        try {
            const postInfo = ctx.update.channel_post;
            let message = "🗞 Вышел новый пост на канале";
            if(postInfo.video_chat_started) message = "Началась трансляция на канале";
            else if (postInfo.voice_chat_ended) message = "Закончилась трансляция на канале";
            const ch = global.Channel;

            ch.forEach(async (elem) => {
                if(ctx.update.channel_post.chat.id == elem.id){
                    const _user = await User.find();
                    _user.forEach(async (u) => {
                        try {
                            await ctx.telegram.sendMessage(u.telegram, message, {
                                reply_markup: {
                                    inline_keyboard: [[{
                                        text: elem.name,
                                        url: elem.url
                                    }]]
                                }
                            })
                            Logger.Message(Logger.Mode.PRIVATE, "Сообщение о новом посте отправлено пользователю " + u.telegram)
                        }catch (e) {
                            Logger.Warn(Logger.Mode.PRIVATE, e.message);
                        }

                    })
                }
            });

        } catch (e) {
            Logger.Error(Logger.Mode.PRIVATE, e.message);
        }


    })
}