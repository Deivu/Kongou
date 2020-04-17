const KongouCommand = require('../abstract/KongouCommand.js');

class Play extends KongouCommand {
    get name() {
        return 'play';
    }

    get usage() {
        return 'play [search/link]';
    }

    get description() {
        return 'Automatically fetches the video(s) and joins the channel.';
    }

    _checkURL(string) {
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    }

    async run(msg, args) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel');
        if (!args[0])
            return await msg.channel.send('Admiral, you did not specify a link or search mode');
        const node = this.client.shoukaku.getNode();
        const query = args.join(' ');
        if (this._checkURL(query)) {
            const tracks = await node.rest.resolve(query);
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
        let searchData = await node.rest.resolve(query, 'youtube');
        if (!searchData.tracks.length)
            return await msg.channel.send('Admiral, I didn\'t find anything in the query you gave me');
        const track = searchData.tracks.shift();
        const res = await this.client.queue.handle(node, track, msg);
        await msg.channel.send(`Added the track **${track.info.title}** in queue!`).catch(() => null);
        if (res) await res.play();
    }
}
module.exports = Play;