const { BaseCluster } = require('kurasuta');
const { token } = require('../config.json');

module.exports = class extends BaseCluster {
    launch() {
        return this.client.login(token);
    }
};