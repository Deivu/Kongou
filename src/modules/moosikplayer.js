class Player {
	constructor(Kongou, guildID) {
		this.Kongou = Kongou;
		this.queue = this.Kongou.queue.get(guildID);
		this.guild = this.Kongou.guilds.get(guildID);
		this.voiceConnection = this.Kongou.voiceConnections.get(guildID);
		this.textChannel = this.guild.channels.get(this.queue.textChannel);
	};

	drain(readable) {
		return new Promise(res => {
			const interval = setInterval(() => {
				if (!readable.read()) {
				  clearInterval(interval);
				  readable.destroy();
				  res();
				};
			}, 2);
		});
	};

	async start() {
		if (!this.queue.songs.length) {
			this.Kongou.queue.delete(this.guild.id);
			this.guild.channels.get(this.voiceConnection.channelID).leave();
			return;
		};
		const stream = await this.Kongou.ytdl(this.queue.songs[0].url);
		this.voiceConnection.play(stream, { inlineVolume: true, sampleRate: 128000 });
		this.voiceConnection.setVolume(Math.pow(0.60, 1.660964));
		const onError = (error) => {
			this.Kongou.cannons.fire(error);
		};
		this.voiceConnection.once('end', () => {
			this.drain(stream).then(() => {
				stream.removeListener('error', onError);
				stream.destroy();
			}).catch(this.Kongou.cannons.fire);
			this.voiceConnection.removeListener('error', onError);
			this.queue.songs.shift();
			this.start().catch(this.Kongou.cannons.fire);
		});
		stream.on('error', onError);
		this.voiceConnection.on('error', onError);
		await this.textChannel.createMessage(`Admiral, The Current Song is \`\`\`diff\n- ${this.queue.songs[0].title}\`\`\``);
	};
};

module.exports = Player;