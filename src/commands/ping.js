const Handler = require('../modules/commandHandler.js');

class Ping extends Handler {
    constructor(...args) {
    	super(...args, {
    		name: 'ping',
    		usage: 'Shows the Ping to Discord, Duh'
    	});
    };

    async run() {

    };
};