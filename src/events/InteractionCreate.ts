import type { BaseInteraction } from 'discord.js';
import type { Kongou } from '../Kongou';
import { Event } from '../structure/Event';

export default class Ready extends Event {
	public readonly name: string;
	public readonly once: boolean;
	constructor(client: Kongou) {
		super(client);
		this.name = 'interactionCreate';
		this.once = false;
	}

	async run(interaction: BaseInteraction): Promise<void> {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.guildId)
			return await this.client.sendInteractionMessage(interaction, 'This command is only available in a guild text channel');
		await this.client.interactions.processChatInputInteraction(interaction);
	}
}
