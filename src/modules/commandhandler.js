class CommandHandler {
    constructor(Kongou, msg) {
        this.Kongou = Kongou;
        this.msg = msg;
        this.args = msg.content.split(/+ /);
        this.command = Kongou.commands.get(msg.content.split(/+ /)[0].toLowerCase);
    };
};