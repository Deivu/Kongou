const Handler = require('../modules/commandhandler.js');

class Help extends Handler {
    constructor(Kongou) {
    	super(Kongou, {
    		name: 'help',
    		usage: 'Shows this menu again..',
    		category: 'Misc',
    		level: 0
    	});
    };

    async run(msg, args) {
		const string = args.slice(1).join(' ');
		if (!string) { 
			const array = Array.from(this.Kongou.commands.values());
			return await msg.channel.createMessage({
                embed: {
                    color: 0x2C2F33,
                    thumbnail: {
                        url: this.Kongou.user.avatarURL
                    },
                    fields: [{
                        name: 'Misc',
                        value: array.map(x => {
						    if (x.help.category === 'Misc') {
							    return `\`${x.help.name}\``;
                            }
                        }).join(' ')
                    }, {
                        name: 'Moosik',
                        value: array.map(x => {
						    if (x.help.category === 'Moosik') {
							    return `\`${x.help.name}\``;
                            }
                        }).join(' ')
                    }],
                    timestamp: new Date(),
                    footer: {
                        icon_url: this.Kongou.user.avatarURL,
                        text: 'Help Menu'
                    }
                }
            });
		} else if (this.Kongou.commands.has(string)) {
			const command = this.Kongou.commands.get(string);
			await msg.channel.createMessage({
                embed: {
                    color: 0x2C2F33,
                    thumbnail: {
                        url: this.Kongou.user.avatarURL
                    },
                    fields: [{
                        name: 'Command',
                        value: command.help.name
                    }, {
                        name: 'Description',
                        value: command.help.usage
                    }],
                    timestamp: new Date(),
                    footer: {
                        icon_url: this.Kongou.user.avatarURL,
                        text: 'Command Help'
                    }
                }
            });
        }
    };
}

module.exports = Help;