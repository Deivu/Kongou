class Player {
	constructor(Kongou, guildID) {
		this.Kongou = Kongou;
		this.queue = Kongou.queue.get(guildID);
		this.guild = Kongou.guilds.get(guildID);
		this.voiceConnection = Kongou.voiceConnections.get(guildID);
	};

	start() {
		if (this.queue.songs.length === 0) {
			this.Kongou.queue.delete(this.guild.id);
			this.guild.channels.get(this.voiceConnection.channelID).leave();
			return;
		};

		const stream = this.Kongou.ytdl(this.queue.songs[0].url, { quality: 'highestaudio' });
		this.voiceConnection.play(stream, { inlineVolume: true, sampleRate: 96000 });
		this.voiceConnection.setVolume(Math.pow(0.60, 1.660964));
		this.guild.channels.get(this.queue.textChannel).createMessage(`Admiral, The Current Song is \`\`\`diff\n- ${this.queue.songs[0].title}\`\`\``)
		.catch(err => {
			this.Kongou.cannons.fire(err);
		});

		this.voiceConnection.on('end', () => {
			this.voiceConnection.removeAllListeners();
			stream.destroy();
			this.queue.songs.shift();
			this.start();
		});

		this.voiceConnection.on('error', (error) => {
			this.voiceConnection.stopPlaying();
			this.Kongou.cannons.fire(error);
		});
	};
};

module.exports = Player;