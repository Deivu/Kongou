const KongouEvent = require('../abstract/KongouEvent.js');

class Ready extends KongouEvent {
    get name() {
        return 'ready';
    }

    get once() {
        return true;
    }

    async run() {
        this.client.logger.debug(`${this.client.user.username}`, `Ready! Serving ${this.client.guilds.cache.size} guild(s) with ${this.client.users.cache.size} user(s)`);
        if (!this.interval) {
            await this.client.user.setActivity('It\'s the English-born returnee, Kongou! Nice to meet you!');
            const ActivityType = [
                `PLAYING`,
                `PLAYING`,
                `PLAYING`
            ]
            const statuses =  [
                'Admiral! You\'ve got mail! Love Letters aren\'t allowed!',
                'Always got to make time for tea-time!',
                'Burning... Love!'
            ];
            let i = 0;
            setInterval(() => this.client.user.setActivity(`${statuses[i++ % statuses.length]}`, { type: ActivityType[i++ % ActivityType.length] }), 300000);
            /*
            this.interval = setInterval(() => {
                const current = statuses.shift();
                this.client.user.setActivity(current);
                statuses.push(current);
            }, 300000);
            */
        }
    }
}
module.exports = Ready;
