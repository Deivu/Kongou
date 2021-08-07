const KongouCommand = require('../abstract/KongouCommand.js');

class Pause extends KongouCommand {
    get name() {
        return 'pause';
    }

    get usage() {
        return 'pause';
    }

    get description() {
        return 'Pause(s) the song';
    }

    async run(msg) {
        if (!msg.member.voice.channelId)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.connection.channelId !== msg.member.voice.channelId)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        dispatcher.player.setPaused(true);
    }
}
module.exports = Pause;
