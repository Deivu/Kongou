const Handler = require('../modules/commandHandler.js');

class Ping extends Handler {
    constructor(...args) {
    	super(...args, {
    		name: 'ping',
    		usage: 'Shows the Ping to Discord, Duh',
    		category: 'Misc',
    		level: 0
    	});
    };

    async run() {
    	await this.msg.channel.createMessage(`Admiral, The Current Ping is **${Math.round(this.msg.channel.guild.shard.latency)} ms**`)
    };
};

module.exports = Ping;