import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { Kongou } from '../../Kongou.js';
import { InteractionContext } from '../../structure/InteractionContext.js';
import { Shuffle as ShuffleArray } from '../../Utils.js';

export const CommandData = new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the entire track queue')
    .toJSON();

export default class Shuffle extends Interaction {
    public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
    public readonly commandOptions: CommandOptions;
    constructor(client: Kongou, directory: string) {
        super(client, directory);
        this.commandData = CommandData;
        this.commandOptions = { music: { channel: true, author: true, queue: true }};
    }

    async run(context: InteractionContext): Promise<void> {
        const queue = context.queue!;
        if (queue.tracks.length > 2) {
            const tracks = ShuffleArray(queue.tracks.remove(1, queue.tracks.length));
            for (const track of tracks) queue.tracks.push(track);
        }
        await context.sendInteractionMessage('Shuffled the playback queue');
    }
}
