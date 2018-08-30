class CommandHandler {
    constructor(Kongou, msg) {
        this.Kongou = Kongou;
        this.msg = msg;
        this.args = msg.content.split(/+ /);
        this.command = Kongou.commands.get(msg.content.split(/+ /)[0].toLowerCase);
    };

    async run() {
    	if (this.command) {
    	    if (this.validate()) {
    	    	await this.commands.run();
    	    } else await this.msg.channel.createMessage('Admiral, it appears like **You dont have Permissions** to Perform this Operation.');
        };
    };

    validate() {
    	switch (this.command.level) {
    		case 1:
    		    return this.msg.member.permission.has('manageMessages');
    		    break;
    		default:
    		    return true;
    	};
    };
};

module.exports = CommandHandler;