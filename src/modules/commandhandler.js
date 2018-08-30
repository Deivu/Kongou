class CommandHandler {
    constructor(Kongou) {
        this.Kongou = Kongou;
    };

    async run(msg) {
        const args = msg.content.split(/ +/);
    	const command = args[0].toLowerCase().slice(this.Kongou.misc.prefix.length);
    	try {
    	    if (this.Kongou.commands.has(command)) {
    		    const cached = this.Kongou.commands.get(command);
    		    if (this.validate(msg, cached)) {
    			    await cached.run(msg, args);
    		    } else 
    		        await msg.channel.createMessage('Admiral, it appears like **You dont have Permissions** to Perform this Operation.');
    	    };
    	} catch (error) {
    		this.cannons.fire(error);
    		await msg.channel.createMessage(`Admiral, There is slight malfunction in the Command Module ${command}. Additional Report\`\`\`${error.stack}\`\`\``);
    	};
    };

    validate(msg, command) {
    	switch (command.level) {
    		case 1:
    		    return msg.member.permission.has('manageMessages');
    		    break;
    		case 2:
    		    return msg.member.permission.has('kickMembers');
    		    break;
    		case 3:
    		    return msg.member.permission.has('banMembers');
    		    break;
    		case 4:
    		    return msg.member.permission.has('manageGuild');
    		case 5:
    		    return this.Kongou.misc.owners.includes(msg.author.id);
    		default:
    		    return true;
    	};
    };
};

module.exports = CommandHandler;