class KongouLogger {
    constructor(client) {
        this.client = client;
    }

    get id() {
        return this.client.shard && this.client.shard.id ? this.client.shard.id : '?';
    }

    debug(title, message) {
        console.log(`[Process ${process.pid}] [Cluster ${this.id}] [${title}] ${message}`);
    }

    log(title, message) {
        console.log(`[Process ${process.pid}] [Cluster ${this.id}] [${title}] ${message}`);
    }

    error(error) {
        console.error(`[Process ${process.pid}] [Cluster ${this.id}] `, error);
    }
}

module.exports = KongouLogger;
