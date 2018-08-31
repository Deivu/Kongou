class Player {
	constructor(client, guild) {
		this.Kongou = client;
		this.guildID = guild;
		this.queue = this.Kongou.queue.get(this.guildID);
		this.voiceConnection = this.Kongou.voiceConnections.get(this.guildID);
		this.voiceChannel = this.Kongou.channels.get(this.voiceConnection.channelID);
		this.textChannel = this.Kongou.channels.get(this.queue.textChannel);
	};

	start() {
		if (!this.queue.songs.length) {
			this.queue.delete(this.guildID);
			this.voiceChannel.leave();
		    this.textChannel.createMessage('Admiral, I shall take my leave now, I am already done with the Queue.')
		    .catch(err => {
			    this.Kongou.cannons.fire(err);
	    	});
			return;
		};

		const stream = this.Kongou.ytdl(this.queue.songs[0].url, { quality: 'highestaudio' })
		this.voiceConnection.play(stream, { inlineVolume: true, sampleRate: 96000 });
		this.voiceConnection.setVolume(Math.pow(0.75, 1.660964));
		this.textChannel.createMessage(`Admiral, The Current Song is **${this.queue.songs[0].title}**`)
		.catch(err => {
			this.Kongou.cannons.fire(err);
		});

		this.voiceConnection.once('disconnect', () => {
			this.queue.songs.length = 0;
			this.start();
		});

		this.voiceConnection.on('end', () => {
			this.queue.shift();
			this.start();
		});

		this.voiceConnection.on('error', (error) => {
			this.voiceConnection.end();
			this.Kongou.cannons.fire(error);
		});

	};
};