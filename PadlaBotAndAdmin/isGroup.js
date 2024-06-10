module.exports = async function(ctx){
    return (ctx.update.message.chat.type === "group" || ctx.update.message.chat.type === "supergroup");
}