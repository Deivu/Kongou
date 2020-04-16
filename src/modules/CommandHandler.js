const { readdirSync } = require('fs');
const EventEmitter = require('events');
const config = require('../../config.json');

class CommandHandler extends EventEmitter {
    constructor(client) {
        super();
        this.client = client;
        this.commands = new Map();
        this.built = false;
        this.on('error', error => client.logger.error(error));
    }

    build() {
        if (this.built) return this;
        const commands = readdirSync(this.client.location + '/src/commands');
        for (let command of commands) {
            command = new (require(`../commands/${command}`))(this.client);
            this.commands.set(command.name, command);
        }
        const bind = this.exec.bind(this);
        this.client.on('message', bind);
        this.client.logger.debug(this.constructor.name, `Loaded ${this.commands.size} client command(s)`);
        this.built = true;
        return this;
    }

    async exec(msg) {
        try {
            if (msg.author.bot || msg.channel.type !== 'text') return;
            if (!msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return;
            const config = await this.client.settings.get(msg.guild.id, true);
            if (!msg.content.startsWith(config.prefix)) return;
            const args = msg.content.split(' ');
            let command = args.shift().slice(config.prefix.length);
            if (!this.commands.has(command)) return;
            command  = this.commands.get(command);
            if (command.permissions && !this.permissions(msg, command.permissions)) {
                await msg.channel.send('Admiral, you don\'t have the required permissions to use this command');
                return;
            }
            await command.run(msg, args, config);
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
