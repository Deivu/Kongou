const KongouCommand = require('../abstract/KongouCommand.js');

class Ping extends KongouCommand {
    get name() {
        return 'ping';
    }

    get usage() {
        return 'ping';
    }

    get description() {
        return 'Basic ping and pong command';
    }

    async run(msg) {
        const sent = await msg.channel.send('....');
        await sent.edit(`Command Delay: **${Math.round(sent.createdTimestamp - msg.createdTimestamp)}ms**\nGateway Ping: **${msg.guild.shard.ping}ms**`);
    }
}
module.exports = Ping;