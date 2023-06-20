import { BaseLogger } from 'pino';
import {
    ChatInputCommandInteraction,
    Client,
    ClientOptions,
    EmbedBuilder,
    InteractionReplyOptions,
    Message, MessagePayload,
    TextBasedChannel
} from 'discord.js';
import { Connectors, Shoukaku } from 'shoukaku';
import { ClientStatistics, Colors, Config, Lavalink, Logger, ShoukakuOptions } from './Utils.js';
import { Queue, QueueOptions } from './modules/Queue.js';
import { Interactions } from './modules/Interactions.js';
import { Events } from './modules/Events.js';
import { ClientIpc } from './modules/ClientIpc.js';

export class Kongou extends Client {
    public readonly logger: BaseLogger;
    public readonly shoukaku: Shoukaku;
    public readonly events: Events;
    public readonly interactions: Interactions;
    public readonly ipc: ClientIpc;
    public readonly queue: Map<string, Queue>;
    constructor(options: ClientOptions) {
        super(options);
        this.logger = Logger;
        this.shoukaku = new Shoukaku(new Connectors.DiscordJS(this), Lavalink, ShoukakuOptions);
        this.events = new Events(this);
        this.interactions = new Interactions(this);
        this.ipc = new ClientIpc(this);
        this.queue = new Map();
        this.shoukaku
            .on('ready', name => this.logger.info(`Lavalink Node: ${name} is now ready`))
            .on('reconnecting', (name, left, timeout) => this.logger.warn(`Lavalink Node: ${name} is reconnecting. Tries Left: ${left} | Timeout: ${timeout}s`))
            .on('disconnect', (name, moved) => this.logger.warn(`Lavalink Node: ${name} is disconnected. Moved: ${moved}`))
            .on('error', (name, error) => this.logger.error(error, `Lavalink Node: ${name} threw an error.`))
            .on('debug', (name, message) => {
                const lowercase = message.toLowerCase();
                if (lowercase.includes('status update')) return;
                this.logger.debug(`Lavalink Node: ${name} | ${message}`);
            });
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
                // @ts-expect-error
                statistics[key] += result[key];
        });
        return statistics;
    }

    public async createGuildPlayer(options: Omit<QueueOptions, 'client'>): Promise<Queue> {
        const existing = this.queue.get(options.guildId);
        if (existing) return existing;
        const queue = new Queue({
            client: this,
            ...options
        });
        await queue.connect();
        this.queue.set(queue.guildId, queue);
        return queue;
    }

    public async destroyGuildPlayer(guildId: string): Promise<Queue|undefined> {
        const queue = this.queue.get(guildId);
        if (!queue) return;
        await queue.disconnect();
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
        return await channel.send({ embeds: [ embed ] });
    }

    public async sendInteractionMessage(interaction: ChatInputCommandInteraction, message: string): Promise<void> {
        const embed = new EmbedBuilder()
            .setColor(Colors.Normal)
            .setDescription(message);
        await this.sendInteraction(interaction, { embeds: [ embed ] });
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
            if (!embed.data.author.icon_url) embed.data.author.icon_url = this.user!.displayAvatarURL();
        }
    }
}
