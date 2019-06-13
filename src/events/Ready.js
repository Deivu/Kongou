const KongouEvent = require('../abstract/KongouEvent.js');
const LavalinkServers = require('../../lavalink-server.json');

class Ready extends KongouEvent {
    
    get name() {
        return 'ready';
    }

    get once() {
        return true;
    }
    
    async run() {
        console.log(`Kongou Client: ${this.client.user.username} is now logged in. Serving ${this.client.guilds.size} guilds.`);
        this.client.Shoukaku.buildManager({ id: this.client.user.id, shardCount: 1 }, LavalinkServers);
    }
}
module.exports = Ready;