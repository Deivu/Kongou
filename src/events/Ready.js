const KongouEvent = require('../abstract/KongouEvent.js');


class Ready extends KongouEvent {

    get name() {
        return 'ready';
    }

    get once() {
        return true;
    }

    async run() {
        await this.initializeSettings();
        console.log(`Kongou Client: ${this.client.user.username} is now logged in. Serving ${this.client.guilds.size} guilds.`);
    }

    async initializeSettings() {
        const batch = this.client.db.batch();
        for (const guild of this.client.guilds.values()) {
            try {
                let data = await this.client.db.get(guild.id)
                data = this.client._mergeDefault(this.client.getDefaultConfig, data);
                batch.put(guild.id, data)
            } catch (error) {
                error.type === 'NotFoundError' ? batch.put(guild.id, this.client.getDefaultConfig) : console.error(error);
            }
        }
        console.log(`DB Default Settings: Queued a total of ${batch.length} operations.`);
        await batch.write()
        console.log('DB Default Settings: Succesfully set default settings');
    }
}
module.exports = Ready;
