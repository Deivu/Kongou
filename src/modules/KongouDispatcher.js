class KongouDispatcher {
    constructor(options) {

        this.client = options.client;
        this.guild = options.guild;
        this.text = options.text;
        this.link = options.link;
        this.queue = [];
        this.current = null;

        this.link.player.on('TrackEnd', () => {
            this.play()
                .catch((error) => {
                    console.error(error);
                    this.queue.length = 0;
                    this.leave();
                });
          })
        this.link.player.on('TrackException', console.error);
        this.link.player.on('TrackStuck', (reason) => {
            console.warn(reason);
            this.play()
                .catch((error) => {
                    console.error(error);
                    this.queue.length = 0;
                    this.leave();
                });
          });
        this.link.player.on('WebSocketClosed', (reason) => {
            console.warn(reason);
            this.leave();
        });
    }

    get exists() {
        return this.client.queue.has(this.guild.id);
    }

    async play() {
        if (!this.exists || !this.queue.length)
            return this.leave();
        this.current = this.queue.shift();
        await this.link.player.playTrack(this.current.track);
        await this.text.send('Now Playing: ' + this.current.info.title).catch(() => null);
    }

    leave() {
        this.queue.length = 0;
        this.link.disconnect();
        this.client.queue.delete(this.guild.id);
        this.text.send('Left the channel due to empty queue.').catch(() => null);
    }
}
module.exports = KongouDispatcher;