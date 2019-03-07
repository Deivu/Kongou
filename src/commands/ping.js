const Handler = require('../modules/commandhandler.js');

class Ping extends Handler {
    constructor(Kongou) {
    	super(Kongou, {
    		name: 'ping',
    		usage: 'Shows the Ping to Discord, Duh',
    		category: 'Misc',
    		level: 0
    	});
    };

    async run(msg) {
    	await msg.channel.createMessage(`Admiral, The Current Ping to Discord's API is **${Math.round(msg.channel.guild.shard.latency)} ms**`);
    };
}

module.exports = Ping;