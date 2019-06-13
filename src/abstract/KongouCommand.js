class KongouCommand {
    constructor(client) {
        this.client = client;
        this.permissions = null;

        if (this.constructor === KongouCommand) throw new TypeError('Abstract class "KongouCommand" cannot be instantiated directly.'); 
        if (this.name === undefined) throw new TypeError('Classes extending KongouCommand must have a getter "name"');
        if (this.usage === undefined) throw new TypeError('Classes extending KongouCommand must have a getter "usage"');
        if (this.description === undefined) throw new TypeError('Classes extending KongouCommand must have a getter "description"');
        if (this.run !== undefined) {
            if (this.run.constructor.name !== "AsyncFunction")
                throw new TypeError('Classes extending KongouCommand must implement "run" as async function');
        } else throw new TypeError('Classes extending KongouCommand must implement an async function "run"');
    }
}
module.exports = KongouCommand;