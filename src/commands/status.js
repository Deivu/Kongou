const Handler = require('../modules/commandhandler.js');

class Status extends Handler {
    constructor(Kongou) {
    	super(Kongou, {
    		name: 'status',
    		usage: 'Shows the Status about Kongou.',
    		category: 'Misc',
    		level: 0
    	});
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
                    value: `• Ready For: **${await this.convert(Math.floor(process.uptime()))}**`
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
        const d = Number(seconds);
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        const s = Math.floor(d % 3600 % 60);
        const hDisplay = h > 0 ? h + (h == 1 ? " hr " : " hrs ") : "";
        const mDisplay = m > 0 ? m + (m == 1 ? " min " : " mins ") : "";
        const sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
        return hDisplay + mDisplay + sDisplay; 
    };
};

module.exports = Status;