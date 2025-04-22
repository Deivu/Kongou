import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { Kongou } from '../../Kongou.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { InteractionContext } from '../../structure/InteractionContext.js';

export const CommandData = new SlashCommandBuilder()
	.setName('repeat')
	.setDescription('Sets the repeat option of the player')
	.addSubcommand(option =>
		option
			.setName('off')
			.setDescription('Turns off the repeat mode')
	)
	.addSubcommand(option =>
		option
			.setName('once')
			.setDescription('Repeat the currently playing track')
	)
	.addSubcommand(option =>
		option
			.setName('all')
			.setDescription('Repeat the whole track queue')
	)
	.toJSON();

export default class Repeat extends Interaction {
	public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
	public readonly commandOptions: CommandOptions;
	constructor(client: Kongou, directory: string) {
		super(client, directory);
		this.commandData = CommandData;
		this.commandOptions = { music: { channel: true, author: true, queue: true }};
	}

	static repeatValue(input: string): number {
		switch (input) {
			case 'off': return 0;
			case 'once': return 1;
			case 'all': return 2;
			default: throw new Error('Unsupported repeat value');
		}
	}

	async run(context: InteractionContext): Promise<void> {
		const queue = context.queue!;
		const command = context.interaction.options.getSubcommand();
		queue.repeat = Repeat.repeatValue(command);
		await context.sendInteractionMessage(`Playback repeat is set to: ${command.toUpperCase()}`);
	}
}
