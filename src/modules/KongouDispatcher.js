class KongouDispatcher {
    constructor(options) {

        this.client = options.client;
        this.guild = options.guild;
        this.text = options.text;
        this.link = options.link;
        this.queue = [];
        this.current = null;
        
        this.link.player.on('end', () => {
            this.play()
                .catch((error) => {
                    console.error(error);
                    this.queue.length = 0;
                    this.leave();
                });
        });
        this.link.player.on('stuck', (reason) => {
            console.warn(reason);
            this.play()
                .catch((error) => {
                    console.error(error);
                    this.queue.length = 0;
                    this.leave();
                });
        });
        this.link.player.on('exception', console.error);
        this.link.player.on('voiceClose', this.leave.bind(this));
        this.link.player.on('nodeDisconnect', this.leave.bind(this));
    }

    get exists() {
        return this.client.queue.has(this.guild.id);
    }

    async play() {
        if (!this.exists || !this.queue.length) return this.leave();
        this.current = this.queue.shift();
        await this.link.player.playTrack(this.current.track);
        await this.text.send(`Now Playing: **${this.current.info.title}**`).catch(() => null);
    }

    leave(log) {
        if (log) console.log(log);
        this.queue.length = 0;
        this.link.disconnect();
        this.client.queue.delete(this.guild.id);
        this.text.send('Left the channel due to empty queue.').catch(() => null);
    }
}
module.exports = KongouDispatcher;