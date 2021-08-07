const { MessageEmbed } = require('discord.js');

class KongouDispatcher {
    constructor(options) {
        this.client = options.client;
        this.guild = options.guild;
        this.text = options.text;
        this.player = options.player;
        this.queue = [];
        this.current = null;

        this.player.on('start', () => {
            const embed = new MessageEmbed()
                .setColor(0xff0000)
                .setThumbnail(`https://img.youtube.com/vi/${this.current.info.identifier}/default.jpg`)
                .addField('Now Playing', `[${this.current.info.title}](${this.current.info.uri}) [${KongouDispatcher.humanizeTime(this.current.info.length)}]`)
                .addField('Uploaded by', this.current.info.author);
            this.text.send({ embeds: [ embed ] }).catch(() => null);
        });
        this.player.on('end', () => this.play());
        for (const event of ['closed', 'error']) {
            this.player.on(event, data => {
                if (data instanceof Error || data instanceof Object) this.client.logger.error(data);
                this.queue.length = 0;
                this.destroy();
            });
        }
    }

    static humanizeTime(ms) {
        const seconds = Math.floor(ms / 1000 % 60);
        const minutes = Math.floor(ms / 1000 / 60 % 60);
        // const hours = Math.floor(ms  / 1000 / 3600  % 24);
        return [ minutes.toString(), seconds.toString() ].join(':');
    }

    get exists() {
        return this.client.queue.has(this.guild.id);
    }

    play() {
        if (!this.exists || !this.queue.length) return this.destroy();
        this.current = this.queue.shift();
        this.player
            .setVolume(0.3)
            .playTrack(this.current.track);
    }

    destroy(reason) {
        this.client.logger.debug(this.constructor.name, `Destroyed the player dispatcher @ guild "${this.guild.id}"`);
        if (reason) this.client.logger.debug(this.constructor.name, reason);
        this.queue.length = 0;
        this.player.connection.disconnect();
        this.client.logger.debug(this.player.constructor.name, `Destroyed the connection @ guild "${this.guild.id}"`);
        this.client.queue.delete(this.guild.id);
        this.text.send('Left the channel due to empty queue.').catch(() => null);
    }
}
module.exports = KongouDispatcher;
