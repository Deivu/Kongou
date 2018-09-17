const Handler = require('../modules/commandhandler.js');

class Stop extends Handler {
    constructor(Kongou) {
    	super(Kongou, {
    		name: 'stop',
    		usage: 'Stops the Music Player.',
    		category: 'Moosik',
    		level: 1
    	});
    };

    async run(msg) {
    	if (this.Kongou.queue.has(msg.channel.guild.id)) {
            if (this.Kongou.voiceConnections.has(msg.channel.guild.id)) {
                if (this.Kongou.queue.has(msg.channel.guild.id)) 
					this.Kongou.queue.get(msg.channel.guild.id).songs.length = 0;
                this.Kongou.voiceConnections.get(msg.channel.guild.id).stopPlaying();
            };
        };
    };
};

module.exports = Stop;