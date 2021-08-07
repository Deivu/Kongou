const { Client, Options } = require('discord.js');
const KongouLogger = require('./modules/KongouLogger.js');
const ShoukakuHandler = require('./modules/ShoukakuHandler.js');
const SettingsManager = require('./modules/SettingsManager.js');
const Queue = require('./modules/Queue.js');
const CommandHandler = require('./modules/CommandHandler.js');
const EventHandler = require('./modules/EventHandler.js');

const defaults = require('../misc.json');
const { token } = require('../config.json');

class Kongou extends Client {
    constructor(options) {
        // create cache
        options.makeCache = Options.cacheWithLimits({
            MessageManager: 1,
            PresenceManager: 0,
            GuildEmojiManager: 0,
            GuildBanManager: 0,
            GuildStickerManager: 0,
            StageInstanceManager: 0,
            GuildInviteManager: 0
        });
        // pass options
        super(options);
        this.color = 0x7E686C;
        this.quitting = false;
        this.location = process.cwd();
        
        this.logger = new KongouLogger();
        this.settings = new SettingsManager(this);
        this.shoukaku = new ShoukakuHandler(this);
        this.queue = new Queue(this);

        new CommandHandler(this).build();
        new EventHandler(this).build();
        
        ['beforeExit', 'SIGUSR1', 'SIGUSR2', 'SIGINT', 'SIGTERM'].map(event => process.once(event, this.exit.bind(this)));
    }

    get getDefaultConfig() {
        return defaults;
    }
    
    async login() {
        await super.login(token);
        return this.constructor.name;
    }

    exit() {
        if (this.quitting) return;
        this.quitting = true;
        this.destroy();
    }
}

module.exports = Kongou;
