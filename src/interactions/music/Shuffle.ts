import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { Kongou } from '../../Kongou';
import { CommandOptions, Interaction } from '../../structure/Interaction';
import { InteractionContext } from '../../structure/InteractionContext';
import { Shuffle as ShuffleArray } from '../../Utils';

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
