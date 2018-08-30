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

    async run(Kongou, msg) {
    	await msg.channel.createMessage(`Admiral, The Current Ping is **${Math.round(msg.channel.guild.shard.latency)} ms**`)
    };
};

module.exports = Ping;