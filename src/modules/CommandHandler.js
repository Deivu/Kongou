const fs = require('fs');

class CommandHandler {
    constructor(client) {
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
        console.log(`Command Handler: Loaded ${this.commands.size} commands.`);
    }
}

module.exports = CommandHandler;