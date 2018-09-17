class Player {
	constructor(Kongou, guildID) {
		this.Kongou = Kongou;
		this.queue = this.Kongou.queue.get(guildID);
		this.guild = this.Kongou.guilds.get(guildID);
		this.voiceConnection = this.Kongou.voiceConnections.get(guildID);
		this.textChannel = this.guild.channels.get(this.queue.textChannel);
	};

	async start() {
		if (!this.queue.songs) {
			this.Kongou.queue.delete(this.guild.id);
			this.guild.channels.get(this.voiceConnection.channelID).leave();
			return;
		};

		const stream = this.Kongou.ytdl(this.queue.songs[0].url, { quality: 'highestaudio' });
		this.voiceConnection.play(stream, { inlineVolume: true, sampleRate: 96000 });
		this.voiceConnection.setVolume(Math.pow(0.60, 1.660964));
		await this.textChannel.createMessage(`Admiral, The Current Song is \`\`\`diff\n- ${this.queue.songs[0].title}\`\`\``);

		let error;
		this.voiceConnection.once('end', () => {
			if (!error) this.voiceConnection.removeListener('error', () => {});
			stream.destroy();
			this.queue.songs.shift();
			this.start()
			.catch(err => {
			    this.Kongou.cannons.fire(err);
		    });
		});
		this.voiceConnection.once('error', (error) => {
			error = true;
			this.voiceConnection.stopPlaying();
			this.Kongou.cannons.fire(error);
		});
	};
};

module.exports = Player;