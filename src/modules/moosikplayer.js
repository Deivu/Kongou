class Player {
	constructor(Kongou, guildID) {
		this.Kongou = Kongou;
		this.queue = this.Kongou.queue.get(guildID);
		this.guild = this.Kongou.guilds.get(guildID);
		this.voiceConnection = this.Kongou.voiceConnections.get(guildID);
		this.textChannel = this.guild.channels.get(this.queue.textChannel);
	};

	async start() {
		if (!this.queue.songs.length) {
			this.Kongou.queue.delete(this.guild.id);
			this.guild.channels.get(this.voiceConnection.channelID).leave();
			return;
		};
		const stream = this.Kongou.ytdl(this.queue.songs[0].url, { quality: 'highest' });
		this.voiceConnection.play(stream, { inlineVolume: true, sampleRate: 96000 });
		this.voiceConnection.setVolume(Math.pow(0.60, 1.660964));
		const onConnectionError = (error) => {
			this.voiceConnection.stopPlaying();
			this.voiceConnection.end();
			this.Kongou.cannons.fire(error);
		};
		const onStreamError = (error) => {
			stream.end();
			this.Kongou.cannons.fire(error);
		};
		this.voiceConnection.once('end', () => {
			stream.removeListener('error', onStreamError);
			stream.destroy();
			this.voiceConnection.removeListener('error', onConnectionError);
			this.queue.songs.shift();
			this.start()
			.catch(err => this.Kongou.cannons.fire(err));
		});
		stream.on('error', onStreamError);
		this.voiceConnection.on('error', onConnectionError);
		await this.textChannel.createMessage(`Admiral, The Current Song is \`\`\`diff\n- ${this.queue.songs[0].title}\`\`\``);
	};
};

module.exports = Player;