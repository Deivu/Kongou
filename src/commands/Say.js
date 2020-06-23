const KongouCommand = require('../abstract/KongouCommand.js');

class Say extends KongouCommand {
    get name() {
        return 'say';
    }

    get usage() {
        return 'say ["here"|"everyone"|"none"] [channel_mention] [message]';
    }

    get description() {
        return 'Sends your message in a specific channel of your choice.';
    }

    get permissions() {
        return 'OWNER';
    }

    async run(msg, args) {
        if (!args[0] || !['here', 'everyone', 'none'].includes(args[0]))
            return await msg.channel.send('Admiral, please specify if I would ping anyone in this message.');
        if (!args[1] || !msg.mentions.channels.size)
            return await msg.channel.send('Admiral, where do I need to send this message?');
        const channel = msg.mentions.channels.first();
        let message = args.slice(2).join(' ');
        if (!message)
            return await msg.channel.send('Admiral, what is the message you want me to send?');
        switch(args[0]) {
            case 'here':
                message = message.concat('\n@here');
                break;
            case  'everyone' :
                message = message.concat('\n@everyone');
        }
        await channel.send(message);
        if (msg.channel.id !== channel.id) await msg.channel.send('Message sent, Admiral.');
    }
}
module.exports = Say;
