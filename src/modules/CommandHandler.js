const fs = require('fs');
const EventEmitter = require('events');

class CommandHandler extends EventEmitter {
    constructor(client) {
        super();
        
        this.client = client;
        this.commands = new Map();
    }

    build() {
        const commands = fs.readdirSync(this.client.location + '/src/commands');
        for (const command of commands) {
            const req = require(`../commands/${command}`);
            const init = new req(this.client);
            this.commands.set(init.name, init);
        }
        this.client.on('message', this.exec.bind(this));
        console.log(`Command Handler: Loaded ${this.commands.size} commands.`);
    }

    async exec(msg) {
        try {
            if (msg.author.bot || msg.channel.type !== 'text') return;
            
        } catch (error) {
            this.emit('error', error);
        }
    }
}

module.exports = CommandHandler;