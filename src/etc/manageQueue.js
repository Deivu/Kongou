function manageQueue(msg, data) {
	switch(this.queue.has(msg.channel.guild.id)) {
		case false:
		    const object = {
		    	textChannel: msg.channel.id,
		    	guild: msg.channel.guild.id,
		    	songs: []
		    };
		    object.songs.push({
		    	title: data.title,
		    	url: `https://www.youtube.com/watch?v=${data.id}`
		    });
		    this.queue.set(msg.channel.guild.id, object);

		case true:
		    const serverQueue = this.queue.get(msg.channel.guild.id);
		    const song = 
		    serverQueue.songs.push({
		    	title: data.title,
		    	url: `https://www.youtube.com/watch?v=${data.id}`
		    });
	};
};

module.exports = manageQueue;