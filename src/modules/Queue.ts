import Denque from 'denque';
import { Node, Player, Track } from 'shoukaku';
import { Kongou } from '../Kongou.js';
import { EmbedBuilder, Guild, TextChannel, VoiceChannel } from 'discord.js';
import { Colors, ReadableTime } from '../Utils.js';

export interface QueueOptions {
    client: Kongou;
    guildId: string;
    channelId: string;
    shardId: number;
    messageChannelId: string;
}

export interface UserTrack extends Track {
    userId: string;
}

export enum Repeat {
    OFF,
    ONCE,
    ALL
}

export class Queue {
    public readonly client: Kongou;
    public guildId: string;
    public channelId: string;
    public shardId: number;
    public messageChannelId: string;
    public tracks: Denque<UserTrack>;
    public repeat: Repeat;
    public player: Player|null;
    public initialized: boolean;
    public stopped: boolean;
    constructor(options: QueueOptions) {
        this.client = options.client;
        this.guildId = options.guildId;
        this.channelId = options.channelId;
        this.shardId = options.shardId;
        this.messageChannelId = options.messageChannelId;
        this.tracks = new Denque();
        this.repeat = Repeat.OFF;
        this.player = null;
        this.initialized = false;
        this.stopped = true;
    }

    get guild(): Guild|undefined {
        return this.client.guilds.cache.get(this.guildId);
    }

    get channel(): VoiceChannel|undefined {
        return this.client.channels.cache.get(this.channelId) as VoiceChannel;
    }

    get messageChannel(): TextChannel|VoiceChannel|undefined {
        return this.client.channels.cache.get(this.messageChannelId) as TextChannel|VoiceChannel;
    }

    get idealNodeDefault(): Node|undefined {
        return this.client.shoukaku.getIdealNode();
    }

    public async connect(): Promise<void> {
        if (this.initialized)
            throw new Error('This queue is already connected');
        this.initialized = true;
        this.player = await this.client.shoukaku.joinVoiceChannel({
            guildId: this.guildId,
            channelId: this.channelId,
            shardId: this.shardId
        });
        this.player
            .on('start', () => {
                const track = this.tracks.peekAt(0)!;
                const embed = new EmbedBuilder()
                    .setColor(Colors.Normal)
                    .setTitle(`${track.info.title} [${ReadableTime(track.info.length)}]`)
                    .setURL(track.info.uri || '')
                    .setDescription(`Queued by: <@${track.userId}>`);
                Promise.allSettled([ this.sendEmbedMessage(embed) ]);
            })
            .on('closed', () =>
                Promise.allSettled([
                    this.sendNormalMessage('Player connection was closed unexpectedly'),
                    this.disconnect()
                ])
            )
            .on('stuck', () => {
                this.client.logger.warn('Track playback stuck, force emitting end');
                this.player!.emit('end');
            })
            .on('end', () => {
                if (this.stopped) return;
                if (this.repeat !== Repeat.ONCE) {
                    const track = this.tracks.removeOne(0);
                    if (track && this.repeat === Repeat.ALL) this.tracks.push(track);
                }
                this.playQueue()
                    .catch(() =>
                        Promise.allSettled([
                            this.sendNormalMessage('Player errored and can\'t continue'),
                            this.disconnect(),
                        ])
                    );
            });
    }

    public async disconnect(): Promise<void> {
        this.stopped = true;
        this.player = null;
        this.tracks.clear();
        await this.client.shoukaku.leaveVoiceChannel(this.guildId);
    }

    public async playQueue(): Promise<void> {
        const track = this.tracks.peekAt(0);
        if (!track) {
            await Promise.allSettled([
                this.sendNormalMessage('No more tracks in queue, leaving'),
                this.disconnect()
            ]);
            return;
        }
        await this.player!.playTrack({ track: track.encoded });
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
