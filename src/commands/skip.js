const Handler = require('../modules/commandhandler.js');

class Skip extends Handler {
    constructor(Kongou) {
    	super(Kongou, {
    		name: 'skip',
    		usage: 'Skips the Current Track.',
    		category: 'Moosik',
    		level: 1
    	});
    };

    async run(msg) {
    	if (this.Kongou.queue.has(msg.channel.guild.id)) {
            if (this.Kongou.voiceConnections.has(msg.channel.guild.id)) {
                const queue = this.Kongou.queue.get(msg.channel.guild.id);
                if (msg.channel.id !== queue.textChannel)
                    return msg.channel.createMessage(`Admiral, the music player is currently binded in <#${queue.textChannel}>`)
                queue.player.voiceConnection.stopPlaying();
            }
        }
    };
}

module.exports = Skip;