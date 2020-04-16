class KongouDispatcher {
    constructor(options) {

        this.client = options.client;
        this.guild = options.guild;
        this.text = options.text;
        this.player = options.player;
        this.queue = [];
        this.current = null;

        this.player.on('start', () =>
            this.text.send(`Now Playing: **${this.current.info.title}**`)
                .catch(() => null)
        );

        this.player.on('end', () => {
            this.play()
                .catch(error => {
                    this.queue.length = 0;
                    this.leave();
                    this.client.logger.error(error);
                })
        })

        for (const playerEvent of ['closed', 'error', 'nodeDisconnect']) {
            this.player.on(playerEvent, data => {
                if (data instanceof Error || data instanceof Object) this.client.logger.error(data);
                this.queue.length = 0;
                this.leave();
            })
        }
    }

    get exists() {
        return this.client.queue.has(this.guild.id);
    }

    async play() {
        if (!this.exists || !this.queue.length) return this.leave();
        this.current = this.queue.shift();
        await this.player.playTrack(this.current.track);
    }

    leave(log) {
        if (log) console.log(log);
        this.queue.length = 0;
        this.player.disconnect();
        this.client.queue.delete(this.guild.id);
        this.text.send('Left the channel due to empty queue.').catch(() => null);
    }
}
module.exports = KongouDispatcher;
