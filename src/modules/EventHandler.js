const fs = require('fs');

class EventHandler {
    constructor(client) {
        
        this.client = client;
        this.built = false;
    }

    build() {
        if (this.built) return;
        const events = fs.readdirSync(this.client.location + '/src/events');
        let index = 0;
        for (let event of events) {
            event = new (require(`../events/${event}`))(this.client);
            const bind = event.run.bind(event);
            event.once ? this.client.once(event.name, bind) : this.client.on(event.name, bind);
            index++
        }
        console.log(`Event Handler: Loaded ${index} events.`);
        this.built = true;
    }
}

module.exports = EventHandler;