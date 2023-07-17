import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { Kongou } from '../../Kongou.js';
import { InteractionContext } from '../../structure/InteractionContext.js';
import { LoadType, Track } from 'shoukaku';

export const CommandData = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a track from a supported source')
    .addStringOption(option =>
        option
            .setName('query')
            .setDescription('Query to search for')
            .setRequired(true)
    )
    .toJSON();

export default class Play extends Interaction {
    public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
    public readonly commandOptions: CommandOptions;
    constructor(client: Kongou, directory: string) {
        super(client, directory);
        this.commandData = CommandData;
        this.commandOptions = { music: { channel: true }, ensure: { user: true, member: true }, defer: true };
    }

    async run(context: InteractionContext): Promise<void> {
        let query = context.interaction.options.getString('query')!;
        try {
            new URL(query);
        } catch (error: unknown) {
            query = `ytsearch:${query}`;
        }
        const node = this.client.shoukaku.getIdealNode();
        if (!node)
            throw new Error('No nodes available');
        const result = await node.rest.resolve(query);
        if (!result || [ LoadType.ERROR, LoadType.EMPTY ].includes(result.loadType))
            return await context.sendInteractionMessage('Unfortunately, there are no results for your query');
        const member = context.interaction.member! as GuildMember;
        const player = await this.client.createGuildPlayer({
            guildId: context.interaction!.guildId!,
            channelId: member.voice.channelId!,
            shardId: context.interaction.guild!.shardId,
            messageChannelId: context.interaction.channelId
        });
        let track;
        if (result.loadType === LoadType.PLAYLIST) {
            for (const track of result.data.tracks) {
                const userTrack = {
                    ...track,
                    userId: context.interaction.user.id
                };
                player.tracks.push(userTrack);
            }
        } else if (result.loadType === LoadType.SEARCH) {
            track = result.data[0]!;
            const userTrack = {
                ...track,
                userId: context.interaction.user.id
            };
            player.tracks.push(userTrack);
        } else {
            track = result.data as Track;
            const userTrack = {
                ...track,
                userId: context.interaction.user.id
            };
            player.tracks.push(userTrack);
        }
        if (player.stopped) {
            player.stopped = false;
            await player.playQueue();
        }
        if (result.loadType === LoadType.PLAYLIST)
            await context.sendInteractionMessage(`Loaded ${result.data.info.name} with ${result.data.tracks.length} track(s) in queue!`);
        else
            await context.sendInteractionMessage(`Loaded ${track!.info.title} in the end of the queue!`);
    }
}
