import { ApplicationCommandOptionType, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { Kongou } from '../../Kongou.js';
import { InteractionContext } from '../../structure/InteractionContext.js';

export const CommandData = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all the commands available')
    .toJSON();

export default class Help extends Interaction {
    public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
    public readonly commandOptions: CommandOptions;
    constructor(client: Kongou, directory: string) {
        super(client, directory);
        this.commandData = CommandData;
        this.commandOptions = {};
    }

    async run(context: InteractionContext): Promise<void> {
        const categories = new Map<string, string[]>();
        for (const command of this.client.interactions.commands.values()) {
            let category = categories.get(command.directory);
            if (!category) {
                category = [];
                categories.set(command.directory, category);
            }
            const subCommands =
                command.commandData.options?.filter(options => options.type === ApplicationCommandOptionType.Subcommand) || [];
            const subCommandGroups =
                command.commandData.options?.filter(options => options.type === ApplicationCommandOptionType.SubcommandGroup) || [];
            if (!subCommands.length && !subCommandGroups.length) {
                category.push(`/${command.commandData.name}`);
                continue;
            }
            if (subCommands.length) {
                for (const subCommand of subCommands)
                    category.push(`/${command.commandData.name} ${subCommand.name}`);
            }
            for (const subCommandGroup of subCommandGroups) {
                // @ts-expect-error
                for (const subCommand of subCommandGroup.options)
                    category.push(`/${command.commandData.name} ${subCommandGroup.name} ${subCommand.name}`);
            }
        }
        const fields: { name: string, value: string }[] = [];
        for (const [ category, commands ] of categories)
            fields.push({
                name: `${category.charAt(0).toUpperCase()}${category.slice(1)} (${commands.length})`,
                value: commands.map(name => `\`${name}\``).join(', ')
            });
        const embed = new EmbedBuilder()
            .addFields(...fields)
            .setFooter({ text: `${this.client.interactions.commands.size} command(s) available` });
        await context.sendInteraction({ embeds: [ embed ] });
    }
}
