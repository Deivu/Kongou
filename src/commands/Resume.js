const KongouCommand = require('../abstract/KongouCommand.js');

class Resume extends KongouCommand {
    get name() {
        return 'resume';
    }

    get usage() {
        return 'resume';
    }

    get description() {
        return 'resumes the paused song';
    }

    async run(msg) {
        if (!msg.member.voice.channelId)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.connection.channelID !== msg.member.voice.channelId)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        await dispatcher.resume();
    }
}
module.exports = Resume;
