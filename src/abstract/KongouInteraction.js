class KongouInteraction {
    constructor(client) {
        this.client = client;
        this.category = null;
        if (this.constructor === KongouInteraction) throw new TypeError('Abstract class "KongouInteraction" cannot be instantiated directly.'); 
        if (this.name === undefined) throw new TypeError('Classes extending KongouInteraction must have a getter "name"');
        if (this.description === undefined) throw new TypeError('Classes extending KongouInteraction must have a getter "description"');
        if (this.permissions === undefined) throw new TypeError('Classes extending KongouInteraction must have a getter "permission"');
        if (this.options === undefined) throw new TypeError('Classes extending KongouInteraction must have a getter "options"');
        if (this.run === undefined) throw new TypeError('Classes extending KongouInteraction must implement an async function "run"');
        if (this.run.constructor.name !== 'AsyncFunction') throw new TypeError('Classes extending KongouInteraction must implement "run" as an async function');
    }
    get permissions() { 
        return null; 
    }
    get options() { 
        return null; 
    }
    get interactionData() {
        return { name: this.name, description: this.description, options: this.options };
    }
}
module.exports = KongouInteraction;