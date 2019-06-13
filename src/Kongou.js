const fs = require('fs');
const { Client } = require('discord.js');
const { Shoukaku, ShoukakuResolver } = require('shoukaku');
const Level = require('level');

const CommandHandler = require('./modules/CommandHandler.js');
const EventHandler = require('./modules/EventHandler.js'); 

const LavalinkServers = require('../lavalink-server.json');

class Kongou extends Client {
    constructor(options) {
        super(options);
        Object.defineProperty(this, 'location', { value: process.cwd() });

        this.Shoukaku = new Shoukaku(this, {
            resumable: true,
            resumableTimeout: 15,
            resumekey: 'Kongou',
            reconnectInterval: 5000,
            reconnectTries: 3,
            handleNodeDisconnects: true
        });
        this.ShoukakuResolver = new ShoukakuResolver(LavalinkServers[0]);
        this.handlers = {};

        this.Shoukaku.on('nodeReady', (host) => console.log(`Lavalink Host: ${host} is now connected`));
        this.Shoukaku.on('nodeError', (error, host) => console.log(`Lavalink Host: ${host} emitted an error. ${error}`));
        this.Shoukaku.on('nodeDisconnect', (host) => console.log(`Lavalink Host: ${host} is now disconnected and cleaned from hosts.`));
    }

    build() {
        console.log('Kongou Client: Building the client');
        if (!fs.existsSync(this.location + '/db')) {
            console.log('Kongou Client: LevelDB database not found, creating database');
            fs.mkdirSync(this.location + '/db');
        }
        this.db = Level(`${this.location}/db/storage-db`);
        console.log('Kongou Client: LevelDB database connected');
        this.handlers.commands = new CommandHandler(this);
        this.handlers.events = new EventHandler(this);
        for (const handler of Object.values(this.handlers)) handler.build();
        console.log('Kongou Client: Client is now built');
    }
}

module.exports = Kongou;