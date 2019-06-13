const fs = require('fs');

class EventHandler {
    constructor(client) {
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

    exec(func, ...args) {
        func.run(...args).catch(console.error);
    }
}

module.exports = EventHandler;