import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { Kongou } from '../../Kongou.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { InteractionContext } from '../../structure/InteractionContext.js';

export const CommandData = new SlashCommandBuilder()
	.setName('resume')
	.setDescription('Resumes the music playback')
	.toJSON();

export default class Resume extends Interaction {
	public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
	public readonly commandOptions: CommandOptions;
	constructor(client: Kongou, directory: string) {
		super(client, directory);
		this.commandData = CommandData;
		this.commandOptions = { music: { channel: true, author: true, queue: true }};
	}

	async run(context: InteractionContext): Promise<void> {
		const queue = context.queue!;
		if (queue.paused) await queue.player!.setPaused(!queue.paused);
		await context.sendInteractionMessage('Resumed the music playback');
	}
}
