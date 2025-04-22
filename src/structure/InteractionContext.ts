import { ChatInputCommandInteraction, InteractionReplyOptions, MessagePayload, User, GuildMember } from 'discord.js';
import type { Kongou } from '../Kongou.js';
import { Queue } from '../modules/Queue.js';

export class InteractionContext {
	public readonly client: Kongou;
	public readonly interaction: ChatInputCommandInteraction;
	constructor(client: Kongou, interaction: ChatInputCommandInteraction) {
		this.client = client;
		this.interaction = interaction;
	}

	public get user(): User {
		return this.interaction.user;
	}

	public get member(): GuildMember | undefined {
		return this.interaction.guild!.members.cache.get(this.user?.id);
	}

	public get me(): GuildMember | undefined {
		return this.interaction.guild!.members.me ?? undefined;
	}

	public get queue(): Queue | undefined {
		return this.client.queue.get(this.interaction.guildId!);
	}

	public sendInteractionMessage(message: string): Promise<void> {
		return this.client.sendInteractionMessage(this.interaction, message);
	}

	public sendInteraction(options: string | MessagePayload | InteractionReplyOptions): Promise<void> {
		return this.client.sendInteraction(this.interaction, options);
	}
}
