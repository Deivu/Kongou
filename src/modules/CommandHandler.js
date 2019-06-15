const fs = require('fs');
const EventEmitter = require('events');
const config = require('../../config.json');

class CommandHandler extends EventEmitter {
    constructor(client) {
        super();
        
        this.client = client;
        this.commands = new Map();
        this.built = false;

        this.on('error', console.error);
    }

    build() {
        if (this.built) return;
        const commands = fs.readdirSync(this.client.location + '/src/commands');
        for (let command of commands) {
            command = new (require(`../commands/${command}`))(this.client);
            this.commands.set(command.name, command);
        }
        const bind = this.exec.bind(this);
        this.client.on('message', bind);
        console.log(`Command Handler: Loaded ${this.commands.size} commands.`);
        this.built = true;
    }

    async getConfig(id) {
        let config;
        try {
            config = await this.client.db.get(id);
        } catch (error) {
            if (!error.notFound) throw error;
            config = this.client.getDefaultConfig;
        }
        return config;
    }

    async exec(msg) {
        try {
            if (msg.author.bot || msg.channel.type !== 'text') return;
            if (!msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return; 
            const config = await this.getConfig(msg.guild.id);
            if (!msg.content.startsWith(config.prefix)) return;
            const args = msg.content.split(' ');
            const command = args.shift().slice(config.prefix.length);
            const cache = this.commands.get(command);
            if (!cache) return;
            if (cache.permissions) {
                const allowed = this.permissions(msg, cache.permissions);
                if (!allowed)
                    return await msg.channel.send('Admiral, you don\'t have the required permissions to use this command');
            }
            await cache.run(msg, args, config);
        } catch (error) {
            this.emit('error', error);
        }
    }

    permissions(msg, perms) {
        if (!Array.isArray(perms)) perms = [perms];
        if (perms.includes('OWNER')) 
            return config.owners.includes(msg.author.id);
        return msg.channel.permissionsFor(msg.member).has(perms);
    }
}

module.exports = CommandHandler;