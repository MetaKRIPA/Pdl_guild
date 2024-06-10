const colors = require('colors');
const fs = require("fs");

class Logger{

    static Message(title, text){
        console.log(this.getDateNow().magenta + " " + title + " " + text);
        title = "[ " + (title.toString().split("[ ")[1].split(" ]")[0]) + " ]";
        let data = this.getDateNow() + " " + title + " " + text;
        fs.appendFileSync(`logs/${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}.txt`,
            `\n${data}`);
    }

    static Warn(title, text){
        console.log(this.getDateNow().magenta +  " " + title + " " + ("[ WARN ] ").yellow  + text);
        title = "[ " + (title.toString().split("[ ")[1].split(" ]")[0]) + " ]";
        let data = this.getDateNow() + " " + title + " " + "[ WARN ] " + text;
        fs.appendFileSync(`logs/${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}.txt`,
            `\n${data}`);
    }

    static Error(title, text){
        console.log(this.getDateNow().magenta + " " + title + " " + ("[ ERROR ] ").red + (text).toString().red);
        title = "[ " + (title.toString().split("[ ")[1].split(" ]")[0]) + " ]";
        let data = this.getDateNow() + " " + title + " " + "[ ERROR ] " + text;
        fs.appendFileSync(`logs/${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}.txt`,
            `\n${data}`);
    }

    static getDateNow(){
        let date = new Date();
        return date.toDateString() + " | " + date.toLocaleTimeString();
    }

    // red | green | yellow | blue | magenta | cyan | gray
    static Mode = {
        SERVER: "[ Server ]".green,
        GROUP: "[ Group ]".yellow,
        PRIVATE: "[ Private ]".blue,
        AXIOS: "[ Axios ]".red,
        NFT: "[ NFT ]".cyan,
        DATABASE: "[ DataBase ]".green,
        CRON: "[ Cron ]".yellow,
        REMOVE: "[ Remove ]".red
    }
}

module.exports = Logger;