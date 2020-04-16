const { existsSync, mkdirSync } = require('fs');
const { cached } = require('sqlite3');
const { open } = require('sqlite');
const KongouSetting = require('../abstract/KongouSetting.js');

class SettingsManager {
    constructor(client) {
        this.client = client;
        this.db = null;
        if (!existsSync(client.location + '/db')) {
            client.logger.debug(this.constructor.name, 'DB Folder not found, creating');
            mkdirSync(client.location + '/db');
        }
        open({ filename: `${client.location}/db/Settings.db`, driver: cached.Database })
            .then((db) => {
                client.logger.debug(this.constructor.name, 'SQLITE Database "Settings" is now connected')
                db.exec(`CREATE TABLE IF NOT EXISTS Settings(id TEXT PRIMARY KEY, prefix TEXT DEFAULT '${client.getDefaultConfig.prefix}')`)
                    .then(() => {
                        this.db = db;
                        client.logger.debug(this.constructor.name, 'SQLITE Database "Settings" created');
                    })
                    .catch(error => client.logger.error(error))
            })
            .catch(error => client.logger.error(error));
    }

    async createDefaults(guildID) {
        const statement = await this.db.prepare('INSERT INTO Settings VALUES(?, ?)', [guildID, this.client.getDefaultConfig.prefix])
        await statement.run();
    }

    async get(guildID, createIfNotExist = false) {
        let statement = await this.db.prepare('SELECT * FROM Settings WHERE id = ? LIMIT 1', guildID);
        statement = await statement.get();
        if (!statement) {
            if (!createIfNotExist) return;
            await this.createDefaults(guildID);
            statement = await this.db.prepare('SELECT * FROM Settings WHERE id = ? LIMIT 1', guildID);
            statement = await statement.get();
        }
        return new KongouSetting(statement, this.db);
    }

    async destroy(guildID) {
        const statement = await this.db.prepare('DELETE FROM Settings WHERE id = ? LIMIT 1', guildID);
        await statement.run();
    }
}

module.exports = SettingsManager;

