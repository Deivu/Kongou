import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Kongou } from '../../Kongou.js';
import { UserTrack } from '../../modules/Queue.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { InteractionContext } from '../../structure/InteractionContext.js';
import { Paginate, ReadableTime } from '../../Utils.js';

export const CommandData = new SlashCommandBuilder()
	.setName('queue')
	.setDescription('Shows the current queue')
	.addNumberOption(option =>
		option
			.setName('page')
			.setDescription('Queue page to view')
	)
	.toJSON();

export default class Queue extends Interaction {
	public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
	public readonly commandOptions: CommandOptions;
	constructor(client: Kongou, directory: string) {
		super(client, directory);
		this.commandData = CommandData;
		this.commandOptions = { music: { queue: true }};
	}

	static generateEntry(track: UserTrack, page: number, index: number) {
		return `\`${page + (index)}}\` \`${track.info.title} [${ReadableTime(track.info.length)}]\` - <@${track.userId}>`;
	}

	async run(context: InteractionContext): Promise<void> {
		const queue = context.queue!;
		const page = context.interaction.options.getNumber('page') ?? 1;
		const tracks = Paginate(queue.tracks.toArray(), page, 10);
		const embed = new EmbedBuilder()
			.setTitle('Current Queue');
		if (!tracks.length)
			embed.setDescription('`No track(s) in queue...`');
		else
			embed.setDescription(tracks.map((track, index) => Queue.generateEntry(track, page, index)).join('\n'))
				.setFooter({ text: `${queue.tracks.length} total track(s)` });
		await context.sendInteraction({ embeds: [ embed ]});
	}
}
