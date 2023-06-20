import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { Kongou } from '../../Kongou.js';
import { InteractionContext } from '../../structure/InteractionContext.js';
import { Colors } from '../../Utils.js';

export const CommandData = new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluates a given code')
    .addStringOption(option =>
        option
            .setName('code')
            .setDescription('Code to evaluate')
            .setRequired(true)
    )
    .toJSON();

export default class Eval extends Interaction {
    public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
    public readonly commandOptions: CommandOptions;
    constructor(client: Kongou, directory: string) {
        super(client, directory);
        this.commandData = CommandData;
        this.commandOptions = {};
    }

    async run(context: InteractionContext): Promise<void> {
        const embed = new EmbedBuilder();
        try {
            const result = eval(context.interaction.options.getString('code')!);
            embed.setColor(Colors.Normal)
                .setTitle('Code Evaluated')
                .setDescription(`\`\`\`js\n${result}\`\`\``);
        } catch (error: unknown) {
            embed.setColor(Colors.Normal)
                .setTitle('Code Error');
            if (error instanceof Error)
                embed.setDescription(`\`\`\`js\n${error.stack!}\`\`\``);
            else
                embed.setDescription(`\`\`\`js\n${new Error('Unknown error thrown').stack!}\`\`\``);
        }
        await context.sendInteraction({ embeds: [ embed ] });
    }
}
