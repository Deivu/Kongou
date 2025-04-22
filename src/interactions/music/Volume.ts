import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { Kongou } from '../../Kongou.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { InteractionContext } from '../../structure/InteractionContext.js';

export const CommandData = new SlashCommandBuilder()
	.setName('volume')
	.setDescription('Sets a new playback volume')
	.addNumberOption(option =>
		option
			.setName('query')
			.setDescription('The new volume to set')
			.setMinValue(1)
			.setMaxValue(1000)
			.setRequired(true)
	)
	.toJSON();

export default class Volume extends Interaction {
	public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
	public readonly commandOptions: CommandOptions;
	constructor(client: Kongou, directory: string) {
		super(client, directory);
		this.commandData = CommandData;
		this.commandOptions = { music: { channel: true, author: true, queue: true }};
	}

	async run(context: InteractionContext): Promise<void> {
		const queue = context.queue!;
		const query = context.interaction.options.getNumber('query')!;
		await queue.player!.setGlobalVolume(query);
		await context.sendInteractionMessage(`Playback volume is now set to: ${query}%`);
	}
}
