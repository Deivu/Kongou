import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import { Routes, EmbedBuilder, ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import { readdirSync } from 'fs';
import { Kongou } from '../Kongou.js';
import { Interaction } from '../structure/Interaction.js';
import { InteractionContext } from '../structure/InteractionContext.js';
import { Config, Colors, UpdateCommandsOptions } from '../Utils.js';


export class Interactions {
    public readonly client: Kongou;
    public readonly commands: Map<string, Interaction>;
    constructor(client: Kongou) {
        this.client = client;
        this.commands = new Map();
    }

    public async load(): Promise<void> {
        if (this.commands.size) return;
        const directories = readdirSync('./dist/interactions', { withFileTypes: true });
        for (const directory of directories) {
            if (!directory.isDirectory()) continue;
            const commands = readdirSync(`./dist/interactions/${directory.name}`, { withFileTypes: true });
            for (const command of commands) {
                if (!command.isFile() || !command.name.endsWith('.js')) continue;
                const location = `../interactions/${directory.name}/${command.name}`;
                const file = await import(location);
                const interaction: Interaction = new file.default(this.client, directory.name);
                const name = interaction.commandData.name;
                this.commands.set(name, interaction);
                this.client.logger.debug(`Loaded Command: ${directory.name}/${name}`);
            }
        }
        this.client.logger.debug(`Finished loading ${this.commands.size} command(s)`);
    }

    public async updateClientCommands(options: UpdateCommandsOptions): Promise<void> {
        const rest = new REST().setToken(Config.token);
        const body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
        if (!options.clear) {
            for (const command of this.commands.values())
                body.push(command.commandData);
        }
        if (options.guildId) {
            await rest.put(Routes.applicationGuildCommands(this.client.user!.id, options.guildId), { body });
            this.client.logger.debug(`Updated slash command(s) successfully at ${options.guildId} | Clear?: ${options.clear}`);
            return;
        }
        await rest.put(Routes.applicationCommands(this.client.user!.id), { body });
        this.client.logger.debug(`Updated slash command(s) successfully globally | Clear?: ${options.clear}`);
    }

    public async processChatInputInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
        const context = new InteractionContext(this.client, interaction);
        try {
            const command = this.commands.get(context.interaction.commandName);
            if (!command) return;
            await context.interaction.guild!.members.fetchMe();
            const options = command.commandOptions;
            if (options.owner && !Config.owners.includes(interaction.user!.id as string))
                return await context.sendInteractionMessage('This command is only accessible for my owners');
            if (options.defer)
                await context.interaction.deferReply();
            if (options.ensure) {
                if (options.ensure.user)
                    await this.client.users.fetch(context.user.id);
                if (options.ensure.member)
                    await context.interaction.guild!.members.fetch(context.user.id);
            }
            if (options.music) {
                await context.interaction.guild!.members.fetch(context.user.id);
                if (options.music.channel) {
                    if (!context.member!.voice.channelId)
                        return await context.sendInteractionMessage('Please join a voice channel first, or re-join if you are in one');
                    if (context.me!.voice.channelId && context.member!.voice.channelId !== context.me!.voice.channelId)
                        return await context.sendInteractionMessage('Please join the same voice channel where I am currently in');
                    const { Connect } = PermissionsBitField.Flags;
                    if (context.me!.voice.channel && !context.me!.voice.channel.permissionsFor(context.me!)!.has([ Connect ]))
                        return await context.sendInteractionMessage('Please give me proper connect permission(s) to join this channel');
                }
                if (options.music.author) {
                    const queue = this.client.queue.get(context.interaction.guildId! as string);
                    const { ManageGuild } = PermissionsBitField.Flags;
                    if (queue && !context.member!.permissions.has([ ManageGuild ])) {
                        if (queue.tracks.length && queue.tracks.peekAt(0)!.userId !== context.user.id)
                            return await context.sendInteractionMessage('You don\'t have enough permission(s) to execute this command');
                    }
                }
                if (options.music.queue) {
                    const queue = this.client.queue.get(context.interaction.guildId! as string);
                    if (!queue)
                        return await context.sendInteractionMessage('Please queue some track(s) first before using this command');
                    if (!queue.player)
                        return await context.sendInteractionMessage('Please wait for the player to be ready');
                }
            }
            await command.run(context);
        } catch (error: unknown) {
            this.client.logger.error(error);
            if (error instanceof Error) {
                const embed = new EmbedBuilder()
                    .setColor(Colors.Fail)
                    .setTitle('Command Failed')
                    .setDescription(`\`\`\`js\n${error.message}\`\`\``);
                await context.sendInteraction({ embeds: [ embed ] });
            }
        }
    }
}
