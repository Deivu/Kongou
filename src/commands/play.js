const Handler = require('../modules/commandhandler.js');

class Play extends Handler {
	constructor(Kongou) {
		super(Kongou, {
    		name: 'play',
    		usage: 'Plays a Youtube Video from Link, Playlist or a Search Term.',
    		category: 'Moosik',
    		level: 1
    	});
    	this.Kongou = Kongou;
	};

	async run(msg, args) {
		if (!this.kongou.voiceConnections.has(msg.channel.guild.id)) {
			if (!msg.members.voiceState.channelID)
				return await msg.channel.createMessage('Admiral, You need to Join the Voice Channel first.');

			const voiceChannel = msg.channel.guild.channels.get(msg.members.voiceState.channelID);
			if (!voiceChannel.permissionOverwrites.has('voiceConnect') || !voiceChannel.permissionOverwrites.has('voiceSpeak'))
				return await msg.channel.createMessage('Admiral, You are so dumb. Please grant me Proper Permissions in this Channel.');

			await voiceChannel.join();
		};
	};
};

module.exports = Play;