const KongouDispatcher = require('./KongouDispatcher.js');

class Queue extends Map {
    constructor(client, iterable) {
        super(iterable);

        this.client = client;
    }

    async handle(node, track, msg) {
        const existing = this.get(msg.guild.id)
        if (!existing) {
            const link = await node.joinVoiceChannel({ 
                guildID: msg.guild.id, 
                voiceChannelID: msg.member.voice.channelID 
            });
            const dispatcher = new KongouDispatcher({
                client: this.client,
                guild: msg.guild,
                text: msg.channel,
                link
            });
            dispatcher.queue.push(track);
            this.set(msg.guild.id, dispatcher);
            return dispatcher;
        }
        existing.queue.push(track);
        return null
    }
}
module.exports = Queue;