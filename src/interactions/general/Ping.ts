import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { Kongou } from '../../Kongou.js';
import { CommandOptions, Interaction } from '../../structure/Interaction.js';
import { InteractionContext } from '../../structure/InteractionContext.js';

export const CommandData = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Shows the current connection ping to Discord')
	.toJSON();

export default class Ping extends Interaction {
	public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
	public readonly commandOptions: CommandOptions;
	constructor(client: Kongou, directory: string) {
		super(client, directory);
		this.commandData = CommandData;
		this.commandOptions = {};
	}

	async run(context: InteractionContext): Promise<void> {
		const ping = Math.round(context.interaction.guild!.shard.ping);
		await context.sendInteractionMessage(`Ping pong! The current ping is ${ping}ms`);
	}
}
