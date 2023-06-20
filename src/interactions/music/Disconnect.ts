import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { Kongou } from '../../Kongou.js';
import { InteractionContext } from '../../structure/InteractionContext.js';

export const CommandData = new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Stops and disconnects the player')
    .toJSON();

export default class Disconnect extends Interaction {
    public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
    public readonly commandOptions: CommandOptions;
    constructor(client: Kongou, directory: string) {
        super(client, directory);
        this.commandData = CommandData;
        this.commandOptions = { music: { channel: true, author: true }};
    }

    async run(context: InteractionContext): Promise<void> {
        const queue = await this.client.destroyGuildPlayer(context.interaction.guildId!);
        if (!queue)
            await context.sendInteractionMessage('There are no players to disconnect');
        else
            await context.sendInteractionMessage('Destroyed and disconnected the player');
    }
}
