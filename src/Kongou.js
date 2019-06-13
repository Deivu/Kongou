const fs = require('fs');
const { Client } = require('discord.js');
const { Shoukaku, ShoukakuResolver } = require('../../Shoukaku/index.js');
const Level = require('level');

const CommandHandler = require('./modules/CommandHandler.js');
const EventHandler = require('./modules/EventHandler.js');

const Config = require('../config.json');
const LavalinkServers = require('../lavalink-server.json');

class Kongou extends Client {
    constructor(options) {
        super(options);
        Object.defineProperty(this, 'location', { value: process.cwd() });

        this.Shoukaku = new Shoukaku(this, {
            resumable: true,
            resumableTimeout: 15,
            resumekey: 'Kongou',
            reconnectInterval: 5000
        });
        this.ShoukakuResolver = new ShoukakuResolver(LavalinkServers[0]);
        this.handlers = {};

        this.Shoukaku.on('nodeReady', (host) => console.log(`Lavalink Host: ${host} is now connected`));
        this.Shoukaku.on('nodeError', (error, host) => console.log(`Lavalink Host: ${host} emitted an error. ${error}`));
        this.Shoukaku.on('nodeDisconnect', (host) => console.log(`Lavalink Host: ${host} is now disconnected and cleaned from hosts.`));
    }
    
    get getDefaultConfig() {
        return Config;
    }

    build() {
        console.log('Kongou Client: Building the client');
        if (!fs.existsSync(this.location + '/db')) {
            console.log('Kongou Client: LevelDB database not found, creating database');
            fs.mkdirSync(this.location + '/db');
        }
        this.db = Level(`${this.location}/db/storage-db`, { valueEncoding: 'json' });
        console.log('Kongou Client: LevelDB database connected');
        this.handlers.commands = new CommandHandler(this);
        this.handlers.events = new EventHandler(this);
        for (const handler of Object.values(this.handlers)) handler.build();
        console.log('Kongou Client: Client is now built');
    }

    // Based on Shoukaku's merge
    _mergeDefault(def, given) {
        if (!given) return def;
        const defaultKeys = Object.keys(def);
        for (const key of defaultKeys) {
            if (def[key] === null) {
                if (!given[key]) throw new Error(`${key} was not found and the given options.`);
            }
            if (!given[key]) given[key] = def[key];
        }
        for (const key in defaultKeys) {
            if (defaultKeys.includes(key)) continue;
            delete given[key];
        }
        return given;
    }
}

module.exports = Kongou;