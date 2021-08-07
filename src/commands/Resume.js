const KongouCommand = require('../abstract/KongouCommand.js');

class Resume extends KongouCommand {
    get name() {
        return 'resume';
    }

    get usage() {
        return 'resume';
    }

    get description() {
        return 'Resumes the paused song';
    }

    async run(msg) {
        if (!msg.member.voice.channelId)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.connection.channelId !== msg.member.voice.channelId)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        dispatcher.player.setPaused(false);
    }
}
module.exports = Resume;
