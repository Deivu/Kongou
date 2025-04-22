import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Kongou } from '../../Kongou';
import { CommandOptions, Interaction } from '../../structure/Interaction';
import { InteractionContext } from '../../structure/InteractionContext';
import { ParseSize } from '../../Utils';

export const CommandData = new SlashCommandBuilder()
	.setName('status')
	.setDescription('Shows the current status of the bot')
	.toJSON();

export default class Status extends Interaction {
	public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
	public readonly commandOptions: CommandOptions;
	constructor(client: Kongou, directory: string) {
		super(client, directory);
		this.commandData = CommandData;
		this.commandOptions = {};
	}

	async run(context: InteractionContext): Promise<void> {
		const status = await this.client.fetchGlobalStatistics();
		const embed = new EmbedBuilder()
			.setTitle('Status')
			.setDescription(
				`\`\`\`asciidoc
Guilds   :: ${status.guilds}
Users    :: ${status.users}
Channels :: ${status.channels}
Shards   :: ${status.shards}
Players  :: ${status.players}
Memory   :: ${ParseSize(status.ram, true)}
\`\`\``
			);
		await context.sendInteraction({ embeds: [ embed ]});
	}
}
