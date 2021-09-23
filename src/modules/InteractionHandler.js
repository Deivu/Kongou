const { readdirSync } = require('fs');
const { MessageEmbed } = require('discord.js');
const { Collection } = require('@discordjs/collection');
const EventEmitter = require('events');
const config = require('../../config.json');

class InteractionHandler extends EventEmitter {
    constructor(client) {
        super();
        this.client = client;
        this.commands = new Collection();
        this.built = false;
        this.on('error', error => client.logger.error(error));
        this.client.on('interactionCreate', interaction => this.exec(interaction));
    }

    static checkPermission(permissions, interaction) {
        if (permissions.includes('OWNER')) 
            return config.owners.includes(interaction.user.id);
        else 
            return interaction.channel.permissionsFor(interaction.member).has(permissions);
    }

    build() {
        if (this.built) return this;
        const directories = readdirSync(`${this.client.location}/src/interactions`, { withFileTypes: true });
        for (const directory of directories) {
            if (!directory.isDirectory()) continue;
            const commands = readdirSync(`${this.client.location}/src/interactions/${directory.name}`, { withFileTypes: true });
            for (const command of commands) {
                if (!command.isFile()) continue;
                const Interaction = require(`${this.client.location}/src/interactions/${directory.name}/${command.name}`);
                const Command = new Interaction(this.client);
                Command.category = directory.name.charAt(0).toUpperCase() + directory.name.substring(1);
                this.commands.set(Command.name, Command);
                this.client.logger.debug(this.constructor.name, `\tCommand '${Command.name}' loaded (@${Command.uid})`);
            }
        }
        this.client.logger.debug(this.constructor.name, `Loaded ${this.commands.size} interaction client command(s)`);
        this.built = true;
        return this;
    }

    /**
     * WARNING : The lack of a proper deep-clone in NodeJS, or of any working polyfills makes
     * such operations of 'self-replacement' vulnerable to errors, for that the previous state
     * cannot be stashed and popped back in case of error. Thus, this should only be used as a
     * development tool and not be available to actual users, even admins.
     */
    rebuild() {
        this.client.logger.log(this.constructor.name, `---- Live reload triggered ----`);

        // let stashed = this.commands;
        try {
            this.commands = new Collection();
            this.built = false;

            // Node's require() keeps a cache, which we wanna clear prior to reloading the modules
            Object.keys(require.cache).forEach(function (key) { delete require.cache[key] })
    
            this.build();
        } catch (error) {
            // this.commands = stashed;
            // In case of failure, the special Reload command is still made avaiable
            const ReloadInteraction = require(`${this.client.location}/src/interactions/info/Reload.js`);
            const ReloadCommand = new ReloadInteraction(this.client);
            this.commands.set(ReloadCommand.name, ReloadCommand);
            this.client.on('interactionCreate', interaction => this.exec(interaction));
            this.client.logger.error(this.constructor.name, `Failed to reload commands ! '/reload' was still loaded, fix the issue and reload, teitoku!\nError : ${error}`)
            throw error;
        }

        this.client.logger.log(this.constructor.name, `---- Live reload completed ----`);
        return this; // For the sake of transparency, this behaves just as build()
    }

    async update(guildId) {
        if (!this.client.application?.owner) await this.client.application?.fetch();
        const commands = this.commands.map(command => command.interactionData);
        if (!guildId) {
            // global command 
            await this.client.application?.commands.set(commands);
            this.client.logger.debug(this.constructor.name, `Updated ${commands.size} interaction command(s) [Discord Side]`);
        } else {
            // guild specific command for testing
            await this.client.guilds.cache.get(guildId)?.commands.set(commands);
            this.client.logger.debug(this.constructor.name, `Updated ${this.commands.size} interaction command(s) [Discord Side]`);
        }
    }

    async exec(interaction) {
        try {
            if (!interaction.isCommand()) return;
            const command = this.commands.get(interaction.commandName);
            if (!command) return;
            if (command.permissions && !InteractionHandler.checkPermission(command.permissions, interaction)) 
                return interaction.reply('Teitoku, you don\'t have the required permissions to use this command!');
            // player related stuff
            if (command.playerCheck?.voice && !interaction.member.voice.channelId) 
                return interaction.reply('Teitoku, you are not in a voice channel!');
            const dispatcher = this.client.queue.get(interaction.guildId);
            if (command.playerCheck?.dispatcher && !dispatcher) 
                return interaction.reply('Teitoku, Nothing is playing in this guild!');
            if (command.playerCheck?.channel && dispatcher.player.connection.channelId !== interaction.member.voice.channelId) 
                return interaction.reply('Teitoku, you are not in the same voice channel I\'m currently connected to!');         
            // execute le commandz
            this.client.logger.log(this.constructor.name, `Executing command ${command.name} (@${command.uid})`);
            await command.run({ interaction, dispatcher });
        } catch (error) {
            const embed = new MessageEmbed()
                .setColor(0xff99CC)
                .setTitle('Something errored!')
                .setDescription(`\`\`\`js\n ${error.toString()}\`\`\``)
                .setTimestamp()
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL());
            if (interaction.replied || interaction.deferred) 
                await interaction
                    .editReply({ embeds: [ embed ] })
                    .catch(error => this.emit('error', error));
            else 
                await interaction
                    .reply({ embeds: [ embed ] })
                    .catch(error => this.emit('error', error));
            this.emit('error', error);
        }
    }
}

module.exports = InteractionHandler;
