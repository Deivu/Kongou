const KongouDispatcher = require('./KongouDispatcher.js');

class Queue extends Map {
    constructor(client, iterable) {
        super(iterable);
        this.client = client;
    }

    async handle(guild, member, channel, node, track) {
        const existing = this.get(guild.id);
        if (!existing) {
            let player = this.client.shoukaku.players.get(guild.id);
            if(!player) player = await node.joinChannel({
                guildId: guild.id,
                shardId: guild.shardId,
                channelId: member.voice.channelId
            });
            this.client.logger.debug(player.constructor.name, `New connection @ guild "${guild.id}"`);
            const dispatcher = new KongouDispatcher({
                client: this.client,
                guild,
                channel,
                player
            });
            dispatcher.queue.push(track);
            this.set(guild.id, dispatcher);
            this.client.logger.debug(dispatcher.constructor.name, `New player dispatcher @ guild "${guild.id}"`);
            return dispatcher;
        }
        existing.queue.push(track);
        return null;
    }
}
module.exports = Queue;
