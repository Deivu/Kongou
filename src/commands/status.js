const Handler = require('../modules/commandhandler.js');

class Status extends Handler {
    constructor(Kongou) {
    	super(Kongou, {
    		name: 'status',
    		usage: 'Shows the Status about Kongou.',
    		category: 'Misc',
    		level: 0
    	});
        this.Kongou = Kongou; 
    };

    async run(msg) {
        await msg.channel.createMessage({
            embed: {
                color: 0x2C2F33,
                thumbnail: {
                    url: this.Kongou.user.avatarURL
                },
                fields: [{
                    name: '\:pushpin: Current Status',
                    value: `• Server(s): **${this.Kongou.guilds.size}**\n• Users(s): **${this.Kongou.users.size}**\n• Memory Usage (RSS): **${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB**\n• Memory Usage (Heap Total): **${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB**\n• Memory Usage (Heap Used): **${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB**\n• Memory Usage (C++ Objects): **${Math.round(process.memoryUsage().external / 1024 / 1024)} MB**`,
                    inline: true
                }, {
                    name: '\:pushpin: Current Uptime',
                    value: `• Format(HH:SS): **${await this.convert(Math.floor(process.uptime()))}**`
                }],
                timestamp: new Date(),
                footer: {
                    icon_url: this.Kongou.user.avatarURL,
                    text: `${this.Kongou.user.username}'s Status.`
                }
            }
        });
    };

    async convert(seconds) {
        return ( seconds - (seconds %= 60) ) / 60 + (9 < seconds ? ':' : ':0') + seconds;
    };
};

module.exports = Status;