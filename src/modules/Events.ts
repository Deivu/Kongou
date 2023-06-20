import { Kongou } from '../Kongou.js';
import { Event } from '../structure/Event.js';
import { readdirSync } from 'fs';

export class Events {
    public readonly client: Kongou;
    private built: boolean;
    constructor(client: Kongou) {
        this.client = client;
        this.built = false;
        this.client
            .on('shardReady', id => this.client.logger.info(`Shard ${id} is now ready / re-identified`))
            .on('shardReconnecting', id => this.client.logger.info(`Shard ${id} is reconnecting`))
            .on('shardResume', (id, replay) => this.client.logger.info(`Shard ${id} is resumed with ${replay} replayed event(s)`))
            .on('debug', message => {
                const lowercase = message.toLowerCase();
                if (lowercase.includes('garbage collection') || lowercase.includes('heartbeat') || lowercase.includes('non-crucial payload')) return;
                this.client.logger.debug(message);
            });
    }

    async load(): Promise<void> {
        if (this.built) return;
        let index = 0;
        const events = readdirSync('./dist/events', { withFileTypes: true });
        for (const event of events) {
            if (!event.isFile() || !event.name.endsWith('.js')) continue;
            const location = `../events/${event.name}`;
            const file = await import(location);
            const instance: Event = new file.default(this.client);
            instance.once ?
                this.client.once(instance.name, (...args: unknown[]) => instance.handle(...args)) :
                this.client.on(instance.name, (...args: unknown[]) => instance.handle(...args));
            index++;
            const once = instance.once ? 'once' : 'on';
            this.client.logger.debug(`Loaded Event: ${once}/${instance.name}`);
        }
        this.built = true;
        this.client.logger.debug(`Finished loading ${index} event(s)`);
    }
}
