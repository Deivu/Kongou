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
    		case 2:
    		    return (this.msg.member.permission.has('kickMembers') || this.msg.member.permission.has('banMembers'));
    		    break;
    		case 3:
    		    return this.msg.member.permission.has('manageGuild');
    		case 4:
    		    return this.misc.owners.includes(this.msg.author.id);
    		default:
    		    return true;
    	};
    };
};

module.exports = CommandHandler;