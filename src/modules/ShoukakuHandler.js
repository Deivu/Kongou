const { Shoukaku, Connectors } = require('shoukaku');
const servers = require('../../lavalink-server.json');
const options = require('../../shoukaku-options.js');
    
class ShoukakuHandler extends Shoukaku {
    constructor(client) {
        super(new Connectors.DiscordJS(client), servers, options);
        this.on('ready',
            (name, reconnected) =>
                client.logger.log('Shoukaku', `Lavalink Node: ${name} is now connected, This connection is ${reconnected ? 'resumed' : 'a new connection'}`)
        );
        this.on('error',
            (_, error) =>
                client.logger.error(error)
        );
        this.on('close',
            (name, code, reason) =>
                client.logger.log('Shoukaku', `Lavalink Node: ${name} closed with code: ${code} reason: ${reason || 'No reason'}`)
        );
        this.on('disconnect',
            (name, _, moved) =>
                client.logger.log('Shoukaku', `Lavalink Node: ${name} disconnected ${moved ? 'players have been moved' : 'players have been disconnected'}`)
        );
        this.on('debug',
            (name, info) =>
                client.logger.log('Shoukaku', `Lavalink Node: ${name} ${info || 'No reason'}`)
        );
    }
}

module.exports = ShoukakuHandler;
