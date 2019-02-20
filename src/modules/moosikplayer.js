class Player {
	constructor(Kongou, guildID) {
		this.Kongou = Kongou;
		this.queue = this.Kongou.queue.get(guildID);
		this.guild = this.Kongou.guilds.get(guildID);
		this.voiceConnection = this.Kongou.voiceConnections.get(guildID);
		this.textChannel = this.guild.channels.get(this.queue.textChannel);
		this.stream = null;

		this.voiceConnection.on('end', () => {
			this.drain(this.stream).then(() => {
				this.stream.removeListener('error', this.Kongou.cannons.fire);
				this.stream.destroy();
				this.queue.songs.shift();
				this.stream = null;
				this.start().catch(this.Kongou.cannons.fire);
			}).catch(this.Kongou.cannons.fire);
		});
		this.voiceConnection.on('error', this.Kongou.cannons.fire);
	};

	drain(readable) {
		return new Promise(res => {
			const interval = setInterval(() => {
				if (!readable.read()) {
				  clearInterval(interval);
				  readable.destroy();
				  res();
				};
			}, 1);
		});
	};

	async start() {
		if (!this.queue.songs.length) {
			this.Kongou.queue.delete(this.guild.id);
			this.guild.channels.get(this.voiceConnection.channelID).leave();
			return;
		};
		this.stream = this.Kongou.ytdl(this.queue.songs[0].url);
		this.stream.on('error', this.Kongou.cannons.fire);
		this.voiceConnection.play(this.stream, { inlineVolume: true, sampleRate: 128000 });
		this.voiceConnection.setVolume(Math.pow(0.60, 1.660964));
		await this.textChannel.createMessage(`Admiral, The Current Song is \`\`\`diff\n- ${this.queue.songs[0].title}\`\`\``);
	};
};

module.exports = Player;