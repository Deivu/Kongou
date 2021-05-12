const Walther = require('wa2000');
const { ShardingManager } = require('kurasuta');
const { Constants, Intents, Util } = require('discord.js');
const { join } = require('path');
const { token } = require('./config.json');
const { GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_VOICE_STATES, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS } = Intents.FLAGS;

const KongouLogger = require('./src/modules/KongouLogger.js');
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
const logger = new KongouLogger();

walther.on('ratelimit', info => 
    logger.debug(
        'Walther 2k',                     
        'Ratelimit Handled; Info =>\n' + 
        `  URL                      : ${info.base}${info.endpoint}\n` + 
        `  Bucket [Hash:Major]      : ${info.bucket}\n` +
        `  Requests [Remaining/Max] : ${info.remaining}/${info.limit}\n` +
        `  Retry After              : ${info.after || info.timeout}ms\n` + 
        `  Global Ratelimit         : ${info.global}`
    )
);
walther.spawn();
