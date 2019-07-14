class EventHandlers {
    static onEnd() {
        this.play()
            .catch((error) => {
                console.error(error);
                this.queue.length = 0;
                this.leave();
            })
    }

    static onClean(param) {
        console.error(param instanceof Error || param instanceof Object ? param : `Disconnected Node: ${param}`);
        this.queue.length = 0;
        this.leave();
    }
}

class KongouDispatcher {
    constructor(options) {

        this.client = options.client;
        this.guild = options.guild;
        this.text = options.text;
        this.player = options.player;
        this.queue = [];
        this.current = null;

        this.onEnd = EventHandlers.onEnd.bind(this);
        this.onClean = EventHandlers.onClean.bind(this);

        this.player.on('end', this.onEnd);
        this.player.on('closed', this.onClean);
        this.player.on('error',  this.onClean);
        this.player.on('nodeDisconnect', this.onClean);
    }

    get exists() {
        return this.client.queue.has(this.guild.id);
    }

    async play() {
        if (!this.exists || !this.queue.length) return this.leave();
        this.current = this.queue.shift();
        await this.player.playTrack(this.current.track);
        await this.text.send(`Now Playing: **${this.current.info.title}**`).catch(() => null);
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