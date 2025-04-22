import {
	ChatInputCommandInteraction,
	Client,
	ClientOptions,
	EmbedBuilder,
	InteractionReplyOptions,
	Message, MessagePayload,
	TextBasedChannel
} from 'discord.js';
import { BaseLogger } from 'pino';
import { Shoukaku, Events, createDiscordJSOptions, PlayerEventType } from 'shoukaku';
import { ClientIpc } from './modules/ClientIpc';
import { EventsManager } from './modules/Events';
import { Interactions } from './modules/Interactions';
import { Queue, QueueOptions } from './modules/Queue';
import { ClientStatistics, Colors, Config, Lavalink, Logger, ShoukakuOptions } from './Utils';

export class Kongou extends Client {
	public readonly logger: BaseLogger;
	public readonly shoukaku: Shoukaku;
	public readonly events: EventsManager;
	public readonly interactions: Interactions;
	public readonly ipc: ClientIpc;
	public readonly queue: Map<string, Queue>;
	constructor(options: ClientOptions) {
		super(options);
		this.logger = Logger;
		this.shoukaku = new Shoukaku({
			userId: '484590604106465291',
			nodes: Lavalink,
			connectorOptions: createDiscordJSOptions(this)
		}, ShoukakuOptions);
		this.events = new EventsManager(this);
		this.interactions = new Interactions(this);
		this.ipc = new ClientIpc(this);
		this.queue = new Map();
		this.shoukaku
			.on(Events.Ready, node => this.logger.info(`Lavalink Node: ${node.name} is now ready`))
			.on(Events.Disconnect, node => this.logger.warn(`Lavalink Node: ${node.name} is disconnected.`))
			.on(Events.Error, (_, error) => this.logger.error(error, 'Lavalink threw an error.'))
			.on(Events.PlayerEvent, (_, data) => {
				const queue = this.queue.get(data.guildId);

				if (!queue) return;

				switch (data.type) {
					case PlayerEventType.TrackStartEvent:
						queue.onTrackStart();
						break;
					case PlayerEventType.TrackEndEvent:
						queue.onTrackEnd();
						break;
					case PlayerEventType.TrackStuckEvent:
						queue.onTrackStuck();
						break;
					case PlayerEventType.TrackExceptionEvent:
						queue.onTrackException(data);
						break;
					case PlayerEventType.WebsocketClosedEvent:
						queue.onWebsocketClosedEvent();
						break;

				}
			});

		if (options.ws?.buildStrategy)
			this.logger.debug(`Detected a build strategy function. Function: ${options.ws.buildStrategy.toString()}`);
	}

	public getClientStatistics(): ClientStatistics {
		return {
			channels: this.channels.cache.size,
			guilds: this.guilds.cache.size,
			players: this.queue.size,
			ram: process.memoryUsage().rss,
			shards: this.ws.shards.size,
			users: this.users.cache.size
		};
	}

	public async fetchGlobalStatistics(): Promise<ClientStatistics> {
		const results = await this.ipc.send({ op: 'ClientStatistics' }, true) as ClientStatistics[];
		const statistics = { channels: 0,  guilds: 0,  players: 0,  ram: 0,  shards: 0,  users: 0 };
		results.map(result => {
			for (const key of Object.keys(result))
			// @ts-expect-error: ok
				statistics[key] += result[key];
		});
		return statistics;
	}

	public async createGuildPlayer(options: Omit<QueueOptions, 'client'>): Promise<Queue> {
		const existing = this.queue.get(options.guild.id);
		if (existing) return existing;
		const queue = new Queue({
			client: this,
			...options
		});
		await queue.connect();
		this.queue.set(queue.guild.id, queue);
		queue.once('disconnected', queue => this.queue.delete(queue.guild.id));
		return queue;
	}

	public destroyGuildPlayer(guildId: string): Queue | undefined {
		const queue = this.queue.get(guildId);
		if (!queue) return;
		queue.removeAllListeners();
		queue.disconnect();
		this.queue.delete(guildId);
		return queue;
	}

	public async sendNormalMessage(channel: TextBasedChannel, message: string): Promise<Message> {
		const embed = new EmbedBuilder()
			.setColor(Colors.Normal)
			.setDescription(message);
		return await this.sendEmbedMessage(channel, embed);
	}

	public async sendEmbedMessage(channel: TextBasedChannel, embed: EmbedBuilder): Promise<Message> {
		this.verifyEmbed(embed);

		// @ts-expect-error: ok
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
		return await channel.send({ embeds: [ embed ]});
	}

	public async sendInteractionMessage(interaction: ChatInputCommandInteraction, message: string): Promise<void> {
		const embed = new EmbedBuilder()
			.setColor(Colors.Normal)
			.setDescription(message);
		await this.sendInteraction(interaction, { embeds: [ embed ]});
	}

	public async sendInteraction(interaction: ChatInputCommandInteraction, options: string | MessagePayload | InteractionReplyOptions): Promise<void> {
		if (typeof options !== 'string') {
			if ((options as InteractionReplyOptions).embeds?.length) {
				for (const embed of (options as InteractionReplyOptions).embeds!) {
					if (!(embed instanceof EmbedBuilder)) continue;
					this.verifyEmbed(embed);
				}
			}
		}
		if (interaction.replied)
			await interaction.followUp(options);
		else if (interaction.deferred)
			// @ts-expect-error: ok
			await interaction.editReply(options);
		else if (Date.now() - interaction.createdTimestamp < 3000)
			await interaction.reply(options);
	}

	public async login(token: string = Config.token): Promise<string> {
		this.logger.debug(`Login procedure started. Loading required modules for: [${this.constructor.name}]`);
		await Promise.all([
			this.events.load(),
			this.interactions.load()
		]);
		await this.shoukaku.connect();
		this.ipc.listen();
		this.logger.debug(`Required modules for [${this.constructor.name}] loaded! Logging in....`);
		await super.login(token);
		return '';
	}

	private verifyEmbed(embed: EmbedBuilder): void {
		if (!embed.data.color) embed.setColor(Colors.Normal);
		if (!embed.data.author) {
			embed.setAuthor({
				name: this.user!.username,
				iconURL: this.user!.displayAvatarURL()
			});
		} else {
			if (!embed.data.author.name) embed.data.author.name = this.user!.username;
			embed.data.author.icon_url ??= this.user!.displayAvatarURL();
		}
	}
}
