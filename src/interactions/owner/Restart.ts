import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import { ShardClientUtil } from 'indomitable';
import { Kongou } from '../../Kongou';
import { CommandOptions, Interaction } from '../../structure/Interaction';
import { InteractionContext } from '../../structure/InteractionContext';

export const CommandData = new SlashCommandBuilder()
	.setName('restart')
	.setDescription('Restarts the whole bot')
	.toJSON();

export default class Restart extends Interaction {
	public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
	public readonly commandOptions: CommandOptions;
	constructor(client: Kongou, directory: string) {
		super(client, directory);
		this.commandData = CommandData;
		this.commandOptions = {};
	}

	async run(context: InteractionContext): Promise<void> {
		await context.sendInteractionMessage('Restarting the whole bot sequentially...');
		const shard = this.client.shard! as unknown as ShardClientUtil;
		await shard.restartAll();
	}
}
