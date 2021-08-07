const { MessageEmbed } = require('discord.js');

class KongouDispatcher {
    constructor({ client, guild, channel, player }) {
        this.client = client;
        this.guild = guild;
        this.channel = channel;
        this.player = player;
        this.queue = [];
        this.current = null;
        this.stopped = false;

        this.player.on('start', () => {
            const embed = new MessageEmbed()
                .setColor(0xff0000)
                .setThumbnail(`https://img.youtube.com/vi/${this.current.info.identifier}/default.jpg`)
                .addField('Now Playing', `[${this.current.info.title}](${this.current.info.uri}) [${KongouDispatcher.humanizeTime(this.current.info.length)}]`)
                .addField('Uploaded by', this.current.info.author);
            this.channel
                .send({ embeds: [ embed ] })
                .catch(() => null);
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
        return [ minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0') ].join(':');
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
        this.queue.length = 0;
        this.player.connection.disconnect();
        this.client.queue.delete(this.guild.id);
        this.client.logger.debug(this.player.constructor.name, `Destroyed the player & connection @ guild "${this.guild.id}"\nReason: ${reason || 'No Reason Provided'}`);
        if (this.stopped) return;
        this.channel
            .send('No more songs in queue, feel free to create a new player again!')
            .catch(() => null);
    }
}
module.exports = KongouDispatcher;
