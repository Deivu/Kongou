const KongouDispatcher = require('./KongouDispatcher.js');

class Queue extends Map {
    constructor(client, iterable) {
        super(iterable);
        this.client = client;
    }

    async handle(node, track, msg) {
        const existing = this.get(msg.guild.id);
        if (!existing) {
            const player = await node.joinChannel({
                guildId: msg.guild.id,
                shardId: msg.guild.shardId,
                channelId: msg.member.voice.channelId
            });
            this.client.logger.debug(player.constructor.name, `New connection @ guild "${msg.guild.id}"`);
            const dispatcher = new KongouDispatcher({
                client: this.client,
                guild: msg.guild,
                text: msg.channel,
                player
            });
            dispatcher.queue.push(track);
            this.set(msg.guild.id, dispatcher);
            this.client.logger.debug(dispatcher.constructor.name, `New player dispatcher @ guild "${msg.guild.id}"`);
            return dispatcher;
        }
        existing.queue.push(track);
        return null;
    }
}
module.exports = Queue;
