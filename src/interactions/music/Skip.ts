import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { Kongou } from '../../Kongou.js';
import { InteractionContext } from '../../structure/InteractionContext.js';

export const CommandData = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current track')
    .toJSON();

export default class Skip extends Interaction {
    public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
    public readonly commandOptions: CommandOptions;
    constructor(client: Kongou, directory: string) {
        super(client, directory);
        this.commandData = CommandData;
        this.commandOptions = { music: { channel: true, author: true, queue: true }};
    }

    async run(context: InteractionContext): Promise<void> {
        const queue = context.queue!;
        const track = queue.tracks.peekAt(0)!;
        await queue.player!.stopTrack();
        await context.sendInteractionMessage(`Skipped \`${track.info.title}\``);
    }
}
