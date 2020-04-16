class KongouSetting {
    constructor(raw, db) {
        Object.defineProperty(this, 'db', { value: db });
        this.id = raw.id;
        this.prefix = raw.prefix;
    }

    async setData(prop, value) {
        if (!this[prop] === undefined) return;
        const statement = await this.db.prepare('UPDATE Settings SET prefix = ? WHERE id = ?', [ value, this.id ]);
        await statement.run();
        this[prop] = value;
    }
}
module.exports = KongouSetting;
