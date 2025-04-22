import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { Kongou } from '../../Kongou';
import { CommandOptions, Interaction } from '../../structure/Interaction';
import { InteractionContext } from '../../structure/InteractionContext';

export const CommandData = new SlashCommandBuilder()
	.setName('stop')
	.setDescription('Stops and clears the queue but doesn\'t disconnect the player')
	.toJSON();

export default class Stop extends Interaction {
	public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
	public readonly commandOptions: CommandOptions;
	constructor(client: Kongou, directory: string) {
		super(client, directory);
		this.commandData = CommandData;
		this.commandOptions = { music: { channel: true, author: true, queue: true }};
	}

	async run(context: InteractionContext): Promise<void> {
		const queue = context.queue!;
		queue.tracks.clear();
		queue.stopped = true;
		await queue.player!.stopTrack();
		await context.sendInteractionMessage('Cleared the queue and stopped the music playback');
	}
}
