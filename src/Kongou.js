const fs = require('fs');
const Level = require('level');
const { Client } = require('discord.js');
const { Shoukaku } = require('shoukaku');
const Queue = require('./modules/Queue.js');
const CommandHandler = require('./modules/CommandHandler.js');
const EventHandler = require('./modules/EventHandler.js');

const Defaults = require('../misc.json');

class Kongou extends Client {
    constructor(options) {
        super(options);
        Object.defineProperty(this, 'location', { value: process.cwd() });
        Object.defineProperty(this, 'color', { value: 0x7E686C });

        this.shoukaku = new Shoukaku(this, {
            resumable: 'resumablekongou',
            resumableTimeout: 30,
            reconnectTries: 2,
            restTimeout: 10000
        });
        this.queue = new Queue(this);
        this.handlers = {};

        this.shoukaku.on('ready', (name, resumed) => console.log(`Lavalink Node: ${name} is now connected. This connection is ${resumed ? 'resumed' : 'a new connection'}`));
        this.shoukaku.on('error', (name, error) => console.log(`Lavalink Node: ${name} emitted an error.`, error));
        this.shoukaku.on('close', (name, code, reason) => console.log(`Lavalink Node: ${name} closed with code ${code}. Reason: ${reason || 'No reason'}`));
    }
    
    get getDefaultConfig() {
        return Defaults;
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