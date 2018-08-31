const Handler = require('../modules/commandhandler.js');

class Queue extends Handler {
    constructor(Kongou) {
    	super(Kongou, {
    		name: 'queue',
    		usage: 'Shows the First 6 Queued Music on your Server.',
    		category: 'Moosik',
    		level: 1
    	});
        this.Kongou = Kongou; 
    };

    async run(msg) {
    	if (this.Kongou.queue.has(msg.channel.guild.id)) {
            if (this.Kongou.voiceConnections.has(msg.channel.guild.id)) {
                const queue = this.Kongou.queue.get(msg.channel.guild.id);
                if (queue.songs.length) {
                    const songs = queue.songs.map(x => {
                        if (x.title === queue.songs[0].title) 
                            return `- ${x.title}`;
                        else return `+ ${x.title}`;
                    }).slice(0, 6).join('\n');
                    await msg.channel.createMessage(`\`\`\`diff\n${songs}\`\`\``)
                };
            };
        };
    };
};

module.exports = Queue;