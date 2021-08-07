const KongouCommand = require('../abstract/KongouCommand.js');

class Stop extends KongouCommand {
    get name() {
        return 'stop';
    }

    get usage() {
        return 'stop';
    }

    get description() {
        return 'Stops the playback';
    }   

    async run(msg) {
        if (!msg.member.voice.channelId)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.connection.channelId !== msg.member.voice.channelId)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        dispatcher.queue.length = 0;
        dispatcher.player.stopTrack();
    }
}
module.exports = Stop;