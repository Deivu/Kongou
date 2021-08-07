const { Shoukaku, Libraries } = require('shoukaku');
const servers = require('../../lavalink-server.json');
const options = require('../../shoukaku-options.js');

class ShoukakuHandler extends Shoukaku {
    constructor(client) {
        super(new Libraries.DiscordJS(client), servers, options);
        this.on('ready',
            (name, resumed) =>
                client.logger.log(`Lavalink Node: ${name} is now connected`, `This connection is ${resumed ? 'resumed' : 'a new connection'}`)
        );
        this.on('error',
            (name, error) =>
                client.logger.error(error)
        );
        this.on('close',
            (name, code, reason) =>
                client.logger.log(`Lavalink Node: ${name} closed with code ${code}`, reason || 'No reason')
        );
        this.on('disconnect',
            (name, players, moved) =>
                client.logger.log(`Lavalink Node: ${name} disconnected`, moved ? 'players have been moved' : 'players have been disconnected')
        );
        this.on('debug',
            (name, reason) =>
                client.logger.log(`Lavalink Node: ${name}`, reason || 'No reason')
        );
    }
}

module.exports = ShoukakuHandler;
