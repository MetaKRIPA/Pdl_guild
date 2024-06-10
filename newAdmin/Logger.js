const colors = require('colors');

class Logger{

    static Message(title, text){
        console.log(this.getDateNow().magenta + " " + title + " " + text);
    }

    static Warn(title, text){
        console.log(this.getDateNow().magenta +  " " + title + " " + ("[ WARN ] ").yellow  + text);
    }

    static Error(title, text, file = ""){
        console.log(this.getDateNow().magenta + " " + title + " " + ("[ ERROR ] ").red + file.magenta + " > ".red + (text).toString().red);
    }

    static API(api, error = ""){
        if(error === "") console.log(this.getDateNow().magenta + " " + "[ API ] ".green + api.toString().yellow + " successfully connected".green);
        else console.log(this.getDateNow().magenta + " " + "[ API ] ".red + api.toString().yellow + " has problems: ".red + (error.message).toString().red);
        return null;
    }

    static getDateNow(){
        let date = new Date();
        return date.toDateString() + " | " + date.toLocaleTimeString();
    }

    // red | green | yellow | blue | magenta | cyan | gray
    static Mode = {
        SERVER: "[ Server ]".green,
        DATABASE: "[ Database ]".blue,
        PAGE: "[ Page ]".cyan,
        DEFAULT: "[ Default ]".gray
    }
}

module.exports = Logger;