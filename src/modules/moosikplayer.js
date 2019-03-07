class Player {
	constructor(Kongou, data) {
		this.Kongou = Kongou;
		this.songs = data.songs;
		this.guild = this.Kongou.guilds.get(data.guild);
		this.voiceConnection = this.Kongou.voiceConnections.get(data.guild);
		this.textChannel = this.guild.channels.get(data.textChannel);

		this.voiceConnection.on('end', () => {
			this.songs.shift();
			this.start().catch(this.Kongou.cannons.fire);
		});
		this.voiceConnection.on('error', this.Kongou.cannons.fire);
	};

	async start() {
		if (!this.songs.length) {
			this.Kongou.queue.delete(this.guild.id);
			this.guild.channels.get(this.voiceConnection.channelID).leave();
			return;
		}
		this.voiceConnection.play(this.Kongou.ytdl(this.songs[0].url), { inlineVolume: true, sampleRate: 128000 });
		this.voiceConnection.setVolume(Math.pow(0.60, 1.660964));
		await this.textChannel.createMessage(`Admiral, The Current Song is \`\`\`diff\n- ${this.songs[0].title}\`\`\``);
	};
}

module.exports = Player;