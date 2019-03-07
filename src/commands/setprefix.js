const Handler = require('../modules/commandhandler.js');

class Setprefix extends Handler {
    constructor(Kongou) {
    	super(Kongou, {
    		name: 'setprefix',
    		usage: 'Sets a new prefix depending on what you specified.',
    		category: 'Misc',
    		level: 4
    	});
    };

    async run(msg, args, settings) {
        const prefix = args.slice(1).join(' ')
        if (prefix && prefix.length <= 5) {
            settings.prefix = prefix;
            this.Kongou.persistence.set(msg.channel.guild.id, settings);
            await msg.channel.createMessage(`Admiral, you have customized your prefix to **${prefix}**. In case you forgot you prefix, mention me.`);
        } else await msg.channel.createMessage('Invalid arguments received, please try again Admiral.');
    };
}

module.exports = Setprefix;