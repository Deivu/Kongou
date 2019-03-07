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
			return await msg.channel.createMessage('Admiral, I can\'t play something that I don\'t know.');

		if (!this.Kongou.voiceConnections.has(msg.channel.guild.id)) {
			if (!msg.member.voiceState.channelID)
				return await msg.channel.createMessage('You need to be in a voice channel to use this Admiral.');

			const voiceChannel = msg.channel.guild.channels.get(msg.member.voiceState.channelID);
			const permissions = voiceChannel.permissionsOf(this.Kongou.user.id);
			if (!permissions.has('voiceConnect') || !permissions.has('voiceSpeak'))
				return await msg.channel.createMessage('Admiral, please grant me permissions to join & speak in this channel.');

			await voiceChannel.join();
        }
        const parse = args.slice(1).join(' ').replace(/<(.+)>/g, '$1');
		if (parse.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await this.Kongou.youtube.getPlaylist(parse);
			const videos = await playlist.getVideos();
			for (const data of videos) {
				if (data.thumbnails !== undefined) {
				    await ManageQueue(this.Kongou, msg, data);
                }
            }
            await msg.channel.createMessage(`The playlist \`${playlist.title}\` is now loaded in queue.`);
		} else {
			let data;
			try {
				data = await this.Kongou.youtube.getVideo(parse);
			} catch (error) {
				const searched = await this.Kongou.youtube.searchVideos(args.slice(1).join(' '), 1);
				if (!searched.length)
					return await msg.channel.createMessage('Admiral, do you know how to use a search function properly?');
				data = await this.Kongou.youtube.getVideoByID(searched[0].id);
            }
            if (data.thumbnails === undefined)
		        return await msg.channel.send('This video is private. I can\'t touch something that is private.');
		    await ManageQueue(this.Kongou, msg, data);
		    await msg.channel.createMessage(`The video \`${data.title}\` is now added in queue.`);
        }
    };
}

module.exports = Play;