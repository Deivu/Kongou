const Handler = require('../modules/commandhandler.js');
const ManageQueue = require('../etc/manageQueue.js');

class Play extends Handler {
	constructor(Kongou) {
		super(Kongou, {
    		name: 'play',
    		usage: 'Plays Youtube Video(s) from Link, Playlist or a Search Term.',
    		category: 'Moosik',
    		level: 1
    	});
	};

	async run(msg, args) {
		if (!args.slice(1).join(' '))
			return await msg.channel.createMessage('Admiral, I cannot Play an Invinsible Text.');

		if (!this.Kongou.voiceConnections.has(msg.channel.guild.id)) {
			if (!msg.member.voiceState.channelID)
				return await msg.channel.createMessage('Admiral, You need to Join the Voice Channel first.');

			const voiceChannel = msg.channel.guild.channels.get(msg.member.voiceState.channelID);
			const permissions = voiceChannel.permissionsOf(this.Kongou.user.id);
			if (!permissions.has('voiceConnect') || !permissions.has('voiceSpeak'))
				return await msg.channel.createMessage('Admiral, You are so dumb. Please grant me Proper Permissions in this Channel.');

			await voiceChannel.join();
		};

		const parse = args.slice(1).join(' ').replace(/<(.+)>/g, '$1');
		if (parse.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await this.Kongou.youtube.getPlaylist(parse);
			const videos = await playlist.getVideos();
			for (const data of videos) {
				if (data.thumbnails !== undefined) {
				    await ManageQueue(this.Kongou, msg, data);
			    };
			};
			await msg.channel.createMessage(`Admiral, I added the Playlist \`${playlist.title}\` on the Queue.`);
		} else {
			let data;
			try {
				data = await this.Kongou.youtube.getVideo(parse);
			} catch (error) {
				const searched = await this.Kongou.youtube.searchVideos(args.slice(1).join(' '), 1);
				if (!searched.length)
					return await msg.channel.createMessage('Admiral, You are so dumb. You cannot even search properly ?');
				data = await this.Kongou.youtube.getVideoByID(searched[0].id);
			};
			if (data.thumbnails === undefined) 
		        return await msg.channel.send('Admiral, This is a Private Property. Have some respect to the Owner');
		    await ManageQueue(this.Kongou, msg, data);
		    await msg.channel.createMessage(`Admiral, I added \`${data.title}\` on the Queue.`);
		};
	};
};

module.exports = Play;