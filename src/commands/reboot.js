const Handler = require('../modules/commandhandler.js');

class Reboot extends Handler {
    constructor(Kongou) {
    	super(Kongou, {
    		name: 'reboot',
    		usage: 'Reboots Kongou...',
    		category: 'Misc',
    		level: 5
    	});
    };

    async run(msg) {
    	await msg.channel.createMessage(`Ok Admiral, I will be right back ♪`);
        process.exit();
    };
}

module.exports = Reboot;