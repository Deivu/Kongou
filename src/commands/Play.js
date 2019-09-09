const KongouCommand = require('../abstract/KongouCommand.js');

class Play extends KongouCommand {
    get name() {
        return 'play';
    }

    get usage() {
        return 'play <link or search:youtube or search:soundcloud> <searchterm if search>';
    }

    get description() {
        return 'Automatically fetches the video(s) and joins the channel.';
    }

    async run(msg, args) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel');
        if (!args[0])
            return await msg.channel.send('Admiral, you did not specify a link or search mode');
        const node = this.client.shoukaku.getNode();
        if (!['search:youtube', 'search:soundcloud'].includes(args[0])) {
            const link = args.join(' ');
            const tracks = await node.rest.resolve(link);
            if (!tracks)
                return await msg.channel.send('Admiral, I didn\'t find anything in the query you gave me');
            const isPlaylist = Array.isArray(tracks) && tracks.name;
            const res = isPlaylist ? await this.client.queue.handle(node, tracks.shift(), msg) : await this.client.queue.handle(node, tracks, msg);
            if (isPlaylist) {
                for (const track of tracks) await this.client.queue.handle(node, track, msg);
            }
            await msg.channel.send(isPlaylist ? `Added the playlist **${tracks.name}** in queue!` : `Added the track **${tracks.info.title}** in queue!`).catch(() => null);
            if (res) await res.play();
            return;
        }
        if (!args[1])
            return await msg.channel.send('Admiral, what is the search term you want me to search for?');
        const type = args[0].split(':')[1];
        const tracks = await node.rest.resolve(args.slice(1).join(' '), type);
        if (!tracks.length)
            return await msg.channel.send('Admiral, I didn\'t find anything in the query you gave me');
        const track = tracks.shift();
        const res = await this.client.queue.handle(node, track, msg);
        await msg.channel.send(`Added the track **${track.info.title}** in queue!`).catch(() => null);
        if (res) await res.play();
    }
}
module.exports = Play;