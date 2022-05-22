const { Constants, Intents, Util } = require('discord.js');
const { ShardingManager } = require('kurasuta');
const { join } = require('path');
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
    timeout: 90000,
    token
};

new ShardingManager(join(__dirname, '/src/KongouBaseCluster.js'), sharderOptions).spawn();
