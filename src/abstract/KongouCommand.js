class KongouCommand {
    constructor(client) {
        this.client = client;
        if (this.constructor === KongouCommand) throw new TypeError('Abstract class "KongouCommand" cannot be instantiated directly.'); 
        if (this.name === undefined) throw new TypeError('Classes extending KongouCommand must have a getter "name"');
        if (this.usage === undefined) throw new TypeError('Classes extending KongouCommand must have a getter "usage"');
        if (this.description === undefined) throw new TypeError('Classes extending KongouCommand must have a getter "description"');
        if (this.permissions === undefined) throw new TypeError('Classes extending KongouCommand must have a getter "permission"');
        if (this.run === undefined) throw new TypeError('Classes extending KongouCommand must implement an async function "run"');
        if (this.run.constructor.name !== 'AsyncFunction') throw new TypeError('Classes extending KongouCommand must implement "run" as async function');
    }
    get permissions() { return null; }
}
module.exports = KongouCommand;