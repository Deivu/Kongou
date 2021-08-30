const { Constants, Intents, Util } = require('discord.js');
const { join } = require('path');
const { token } = require('./config.json');
const { GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_VOICE_STATES, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS } = Intents.FLAGS;

const Walther = require('wa2000');
const KongouLogger = require('./src/modules/KongouLogger.js');
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

const ratelimitOptions = {
    handlerSweepInterval: 150000,
    hashInactiveTimeout: 300000,
    requestOffset: 500
};

const walther = new Walther(join(__dirname, '/src/KongouBaseCluster.js'), sharderOptions, ratelimitOptions);
const logger = new KongouLogger();
walther.on('ratelimit', info => logger.debug(
    'Walther 2k',                     
    `  Route                    : ${info.route}\n` + 
    `  Bucket [Hash:Major]      : ${info.bucket}\n` +
    `  Requests [Remaining/Max] : ${info.remaining}/${info.limit}\n` +
    `  Headers Retry After      : ${info.after}ms\n` + 
    `  Calculated Retry After   : ${info.timeout}ms\n` + 
    `  Global Ratelimit         : ${info.global}`)
);
walther.spawn();