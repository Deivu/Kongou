const { readdirSync } = require('fs');

class EventHandler {
    constructor(client) {
        this.client = client;
        this.built = false;
        client.on('shardReconnecting', (id) => client.logger.debug(`Shard ${id}`, 'Shard Reconnecting'));
        client.on('shardResumed', (id, rep) => client.logger.debug(`Shard ${id}`, `Shard Resume | ${rep} events replayed`));
        client.on('shardReady', (id) => client.logger.debug(`Shard ${id}`, 'Shard Ready'));
    }

    build() {
        if (this.built) return this;
        const events = readdirSync(this.client.location + '/src/events');
        let index = 0;
        for (let event of events) {
            event = new (require(`../events/${event}`))(this.client);
            const exec = event.exec.bind(event);
            event.once ? this.client.once(event.name,  event.exec.bind(event)) : this.client.on(event.name, exec);
            index++;
        }
        this.client.logger.debug(this.constructor.name, `Loaded ${index} client event(s)`);
        this.built = true;
        return this;
    }
}

module.exports = EventHandler;
