class CommandHandler {
    constructor(Kongou, {
    		name = 'none',
    		usage = 'none',
    		category = 'Misc',
    		level = 0
    	} = {}) {
        this.Kongou = Kongou;
		this.help = { name, usage, category, level };
		this.whitespaceregex = / +/;
    };

    async run(msg, settings) {
        const args = msg.content.split(this.whitespaceregex);
		const command = args[0].toLowerCase().slice(settings.prefix.length);
    	try {
    	    if (this.Kongou.commands.has(command)) {
    		    const cached = this.Kongou.commands.get(command);
    		    if (this.validate(msg, cached)) {
    			    await cached.run(msg, args, settings);
    		    } else await msg.channel.createMessage('Admiral, you do not have the required permissions to use this command.');
            }
        } catch (error) {
    		this.Kongou.cannons.fire(error);
    		await msg.channel.createMessage(`Admiral, an Error has been caught in the command **${command}**. Additional Report\`\`\`js\n${error.stack}\`\`\``);
        }
    };

    validate(msg, command) {
    	switch (command.level) {
    		case 1:
    		    return msg.member.permission.has('manageMessages');
    		case 2:
    		    return msg.member.permission.has('kickMembers');
    		case 3:
    		    return msg.member.permission.has('banMembers');
    		case 4:
    		    return msg.member.permission.has('manageGuild');
    		case 5:
    		    return this.Kongou.misc.owners.includes(msg.author.id);
    		default:
    		    return true;
        }
    };
}

module.exports = CommandHandler;