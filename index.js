const { Constants, Intents, Util } = require('discord.js');
const { Indomitable } = require('indomitable');
const { token } = require('./config.json');
const { GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_VOICE_STATES, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS } = Intents.FLAGS;

const KongouClient = require('./src/Kongou.js');

// cache settings on client file
const customClientOptions = {
    disableMentions: 'everyone',
    restRequestTimeout: 30000,
    intents: [ GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_VOICE_STATES, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS ]
};

const sharderOptions = {
    clientOptions: Util.mergeDefault(Constants.DefaultOptions, customClientOptions),
    client: KongouClient,
    autoRestart: true,
    token
};

const manager = new Indomitable(sharderOptions);
manager.on('error', console.error);
manager.on('debug', message => console.log(`[Indomitable] [Main] ${message}`));
manager.spawn();
