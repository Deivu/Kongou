class KongouCommand {
    constructor(client) {
        this.client = client;
        this.permissions = null;

        if (this.constructor === KongouCommand) {
            throw new TypeError('Abstract class "KongouCommand" cannot be instantiated directly.'); 
        }
        if (this.name !== undefined) {
            if (!Object.getOwnPropertyDescriptor(this, 'name').get)
                throw new TypeError('Classes extending KongouCommand must implement "name" as a getter');
        } else throw new TypeError('Classes extending KongouCommand must have a getter "name"');
        if (this.usage !== undefined) {
            if (!Object.getOwnPropertyDescriptor(this, 'usage').get)
                throw new TypeError('Classes extending KongouCommand must implement "usage" as a getter');
        } else throw new TypeError('Classes extending KongouCommand must have a getter "usage"');
        if (this.description !== undefined) {
            if (!Object.getOwnPropertyDescriptor(this, 'description').get)
                throw new TypeError('Classes extending KongouCommand must implement "description" as a getter');
        } else throw new TypeError('Classes extending KongouCommand must have a getter "description"');
        if (this.run !== undefined) {
            if (this.run.constructor.name !== "AsyncFunction")
                throw new TypeError('Classes extending KongouCommand must implement "run" as async function');
        } else throw new TypeError('Classes extending KongouCommand must implement an async function "run"');
    }
}
module.exports = KongouCommand;