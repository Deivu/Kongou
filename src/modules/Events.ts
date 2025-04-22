import { readdirSync } from 'fs';
import type { Kongou } from '../Kongou.js';
import type { Event } from '../structure/Event.js';

export class EventsManager {
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
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const file = await import(location);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			const instance: Event = new file.default(this.client);
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
