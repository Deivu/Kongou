const Handler = require('../modules/commandhandler.js');

class Skip extends Handler {
    constructor(Kongou) {
    	super(Kongou, {
    		name: 'skip',
    		usage: 'Skips the Current Track.',
    		category: 'Moosik',
    		level: 1
    	});
        this.Kongou = Kongou; 
    };

    async run(msg) {
    	if (this.Kongou.queue.has(msg.channel.guild.id)) {
            if (this.Kongou.voiceConnections.has(msg.channel.guild.id)) {
                this.Kongou.voiceConnections.get(msg.channel.guild.id).stopPlaying();
            };
        };
    };
};

module.exports = Skip;