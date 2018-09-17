class Player {
	constructor(Kongou, guildID) {
		this.Kongou = Kongou;
		this.queue = this.Kongou.queue.get(guildID);
		this.guild = this.Kongou.guilds.get(guildID);
		this.voiceConnection = this.Kongou.voiceConnections.get(guildID);
		this.textChannel = this.guild.channels.get(this.queue.textChannel);
		this.errormethod = this.error.bind(this);
		this.stream;
	};

	async start() {
		if (!this.queue.songs.length) {
			this.Kongou.queue.delete(this.guild.id);
			this.guild.channels.get(this.voiceConnection.channelID).leave();
			return;
		};

		this.stream = this.Kongou.ytdl(this.queue.songs[0].url, { quality: 'highestaudio' });
		this.voiceConnection.play(this.stream, { inlineVolume: true, sampleRate: 96000 });
		this.voiceConnection.setVolume(Math.pow(0.60, 1.660964));
		await this.textChannel.createMessage(`Admiral, The Current Song is \`\`\`diff\n- ${this.queue.songs[0].title}\`\`\``);

		this.voiceConnection.once('end', () => {
			this.voiceConnection.removeListener('error', this.error);
			this.stream.removeListener('error', this.error);
			this.stream.destroy();
			this.queue.songs.shift();
			this.start()
			.catch(err => {
			    this.Kongou.cannons.fire(err);
		    });
		});
		this.stream.on('error', this.errormethod);
		this.voiceConnection.on('error', this.errormethod);
	};
	
	async error(error) {
		this.voiceConnection.stopPlaying();
		this.Kongou.cannons.fire(error);
	};
};

module.exports = Player;