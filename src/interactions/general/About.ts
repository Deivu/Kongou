import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Kongou } from '../../Kongou';
import { CommandOptions, Interaction } from '../../structure/Interaction';
import { InteractionContext } from '../../structure/InteractionContext';

export const CommandData = new SlashCommandBuilder()
	.setName('about')
	.setDescription('Shows some misc info about me and how to host your own instance')
	.toJSON();

export default class About extends Interaction {
	public readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
	public readonly commandOptions: CommandOptions;
	constructor(client: Kongou, directory: string) {
		super(client, directory);
		this.commandData = CommandData;
		this.commandOptions = {};
	}

	async run(context: InteractionContext): Promise<void> {
		const embed = new EmbedBuilder()
			.setTitle('About me')
			.setURL('https://github.com/Deivu/Kongou')
			.setImage('https://repository-images.githubusercontent.com/146718535/1be290cd-8cbd-477c-bfb7-a9bd13be127b')
			.setThumbnail(this.client.user!.displayAvatarURL())
			.setDescription('A bot that showcases how `@sayanyan (325231623262044162)` implements [Shoukaku](https://github.com/Deivu/Shoukaku) and [Indomitable](https://github.com/Deivu/Indomitable) on his bots. You can get your own copy to self host at [Kongou](https://github.com/Deivu/Kongou)');
		await context.sendInteraction({ embeds: [ embed ]});
	}
}
