import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { Kongou } from '../../Kongou.js';
import { InteractionContext } from '../../structure/InteractionContext.js';

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
        if (!result?.tracks.length)
            return await context.sendInteractionMessage('Unfortunately, there are no results for your query');
        const member = context.interaction.member! as GuildMember;
        const player = await this.client.createGuildPlayer({
            guildId: context.interaction!.guildId!,
            channelId: member.voice.channelId!,
            shardId: context.interaction.guild!.shardId,
            messageChannelId: context.interaction.channelId
        });
        for (const track of result.tracks) {
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
        if (result.playlistInfo.name)
            await context.sendInteractionMessage(`Loaded ${result.playlistInfo.name} with ${result.tracks.length} track(s) in queue!`);
        else
            await context.sendInteractionMessage(`Loaded ${result.tracks[0]!.info.title} in the end of the queue!`);
    }
}
