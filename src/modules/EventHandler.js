const fs = require('fs');

class EventHandler {
    constructor(client) {
        
        this.client = client;
        this.built = false;

        this.client.on('shardReconnecting', (id) => console.log(`WS Shard ${id} is reconnecting.`));
        this.client.on('shardResumed', (id, rep) => console.log(`WS Shard ${id} was able to resume and replay ${rep} events`));
        this.client.on('shardReady', (id) => console.log(`WS Shard ${id} is now ready`));
    }

    build() {
        if (this.built) return;
        const events = fs.readdirSync(this.client.location + '/src/events');
        let index = 0;
        for (let event of events) {
            event = new (require(`../events/${event}`))(this.client);
            const bind = event.run.bind(event);
            event.once ? this.client.once(event.name, bind) : this.client.on(event.name, bind);
            index++;
        }
        console.log(`Event Handler: Loaded ${index} events.`);
        this.built = true;
    }
}

module.exports = EventHandler;