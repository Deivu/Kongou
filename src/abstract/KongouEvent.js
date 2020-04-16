const EventEmitter = require('events');

class KongouEvent extends  EventEmitter {
    constructor(client) {
        super();
        this.client = client;
        if (this.constructor === KongouEvent) throw new TypeError('Abstract class "KongouEvent" cannot be instantiated directly.');
        if (this.name === undefined) throw new TypeError('Classes extending KongouEvent must have a getter "name"');
        if (this.once === undefined) throw new TypeError('Classes extending KongouEvent must have a getter "once"');
        if (this.run !== undefined) {
            if (this.run.constructor.name !== "AsyncFunction")
                throw new TypeError('Classes extending KongouEvent must implement "run" as async function');
        } else throw new TypeError('Classes extending KongouEvent must implement an async function "run"');
        this.on('error', (error) => client.logger.error(error));
    }

    exec(...args) {
        this.run(...args)
            .catch(error => this.emit('error', error));
    }
}
module.exports = KongouEvent;
