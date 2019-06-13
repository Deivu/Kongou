const fs = require('fs');
const { Client } = require('discord.js');
const { Shoukaku, ShoukakuResolver } = require('shoukaku');
const Level = require('level');
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
    }

    async build() {
        console.log('Building the Kongou client');
        if (!fs.existsSync(this.location + '/db')) {
            fs.mkdirSync(this.location + '/db');
        }
        this.db = Level(`${this.location}/db/storage-db`);
    }
}

module.exports = Kongou;