import { EventEmitter } from 'events';
import Denque from 'denque';
import { EmbedBuilder, Guild, TextChannel, VoiceChannel } from 'discord.js';
import { Player, Track } from 'shoukaku';
import type { Kongou } from '../Kongou';
import { Colors, ReadableTime } from '../Utils';

export interface QueueOptions {
	client: Kongou;
	guild: Guild;
	voiceChannel: VoiceChannel;
	messageChannel: TextChannel;
}

export interface UserTrack extends Track {
	userId: string;
}

export enum Repeat {
	OFF,
	ONCE,
	ALL
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export declare interface Queue {
	on(event: 'connected', listener: (queue: Queue) => void): this;
	on(event: 'disconnected', listener: (queue: Queue) => void): this;
	once(event: 'connected', listener: (queue: Queue) => void): this;
	once(event: 'disconnected', listener: (queue: Queue) => void): this;
	off(event: 'connected', listener: (queue: Queue) => void): this;
	off(event: 'disconnected', listener: (queue: Queue) => void): this;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Queue extends EventEmitter {
	public readonly client: Kongou;
	public guild: Guild;
	public voiceChannel: VoiceChannel;
	public messageChannel: TextChannel;
	public tracks: Denque<UserTrack>;
	public repeat: Repeat;
	public player: Player | null;
	public paused: boolean;
	public initialized: boolean;
	public stopped: boolean;
	constructor(options: QueueOptions) {
		super();
		this.client = options.client;
		this.guild = options.guild;
		this.voiceChannel = options.voiceChannel;
		this.messageChannel = options.messageChannel;
		this.tracks = new Denque();
		this.repeat = Repeat.OFF;
		this.player = null;
		this.paused = false;
		this.initialized = false;
		this.stopped = true;
	}

	public async connect(): Promise<void> {
		if (this.initialized)
			throw new Error('This queue is already connected');

		const connection = await this.client.shoukaku.joinVoiceChannel({
			guildId: this.guild.id,
			channelId: this.voiceChannel.id,
			shardId: this.guild.shardId
		});

		this.player = new Player(connection);

		this.initialized = true;
		this.emit('connected', this);
	}

	public onTrackStart(): void {
		const track = this.tracks.peekAt(0)!;
		const embed = new EmbedBuilder()
			.setColor(Colors.Normal)
			.setTitle(`${track.info.title} [${ReadableTime(track.info.length)}]`)
			.setURL(track.info.uri ?? '')
			.setDescription(`Queued by: <@${track.userId}>`);

		Promise
			.allSettled([ this.sendEmbedMessage(embed) ])
			.catch(() => null);
	}

	public onTrackEnd(): void {
		if (this.stopped) return;

		if (this.repeat !== Repeat.ONCE) {
			const track = this.tracks.removeOne(0);
			if (track && this.repeat === Repeat.ALL) this.tracks.push(track);
		}

		this.playQueue()
			.catch(() => {
				this.disconnect();
				Promise.allSettled([
					this.sendNormalMessage('Player errored and can\'t continue')

				]).catch(() => null);
			});
	}

	public onTrackStuck(): void {
		this.client.logger.warn('Track playback stuck, executing onTrackEnd()');
		this.onTrackEnd();
	}

	public onTrackException(data: unknown): void {
		this.client.logger.warn(`Track exception occured | ${JSON.stringify(data)}`);
	}

	public onWebsocketClosedEvent(): void {
		this.disconnect();

		Promise
			.allSettled([
				this.sendNormalMessage('Player connection was closed unexpectedly')
			])
			.catch(() => null);
	}

	public disconnect(): void {
		this.stopped = true;
		this.tracks.clear();
		this.client.shoukaku.leaveVoiceChannel(this.guild.id);
		this.emit('disconnected', this);
	}

	public async playQueue(): Promise<void> {
		const track = this.tracks.peekAt(0);
		if (!track) {
			this.disconnect();
			await Promise.allSettled([
				this.sendNormalMessage('No more tracks in queue, leaving')
			]);
			return;
		}
		await this.player!.playTrack({ track: { encoded: track.encoded }});
	}

	public async sendNormalMessage(message: string): Promise<void> {
		if (!this.messageChannel) return;
		await this.client.sendNormalMessage(this.messageChannel, message);
	}

	public async sendEmbedMessage(embed: EmbedBuilder): Promise<void> {
		if (!this.messageChannel) return;
		await this.client.sendEmbedMessage(this.messageChannel, embed);
	}
}
