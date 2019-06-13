const fs = require('fs');
const EventEmitter = require('events');

class EventHandler extends EventEmitter {
    constructor(client) {
        super();
        
        this.client = client;
        this.built = false;
    }

    build() {
        if (this.built) return
        const events = fs.readdirSync(this.client.location + '/src/events');
        let index = 0;
        for (const event of events) {
            const req = require(`../events/${event}`);
            const func = new req(this.client);
            func.once ? this.client.once(func.name, (...args) => this.exec(func, ...args)) : this.client.on(func.name, (...args) => this.exec(func.run, ...args));
            index++
        }
        console.log(`Event Handler: Loaded ${index} events.`);
    }

    async exec(func, ...args) {
        await func.run(...args)
            .catch((error) => this.emit('error', error));
    }
}

module.exports = EventHandler;