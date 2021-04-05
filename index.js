const Walther = require('wa2000');
const { ShardingManager } = require('kurasuta');
const { Constants, Intents, Util } = require('discord.js');
const { join } = require('path');
const { token } = require('./config.json');
const { GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_VOICE_STATES, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS } = Intents.FLAGS;

const KongouClient = require('./src/Kongou.js');

const customClientOptions = {
    messageCacheMaxSize: 1,
    messageCacheLifetime: 1800,
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

const walther = new Walther(new ShardingManager(join(__dirname, '/src/KongouBaseCluster.js'), sharderOptions));

walther.spawn();
