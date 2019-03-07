const MoosikManager = require('../modules/moosikplayer.js');

async function manageQueue(Kongou, msg, data) {
    if (!Kongou.queue.has(msg.channel.guild.id)) {
    	const object = {
		    textChannel: msg.channel.id,
		    guild: msg.channel.guild.id,
			songs: [],
			player: null
		};
		object.songs.push({
		    title: data.title,
		    url: `https://www.youtube.com/watch?v=${data.id}`
		});
		Kongou.queue.set(msg.channel.guild.id, object);
		object.player = new MoosikManager(Kongou, object);
		await object.player.start();
    } else {
        const serverQueue = Kongou.queue.get(msg.channel.guild.id);
		serverQueue.songs.push({
		    title: data.title,
		    url: `https://www.youtube.com/watch?v=${data.id}`
		});
    }
}
module.exports = manageQueue;