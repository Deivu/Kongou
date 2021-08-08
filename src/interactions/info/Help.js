const { MessageEmbed } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord-api-types/v9');
const KongouInteraction = require('../../abstract/KongouInteraction.js');

class Ping extends KongouInteraction {
    get name() {
        return 'help';
    }

    get description() {
        return 'Want to see my commands and how to use them?';
    }

    get options() {
        return [{
            name: 'command',
            type: ApplicationCommandOptionType.String,
            description: 'Specific command help'
        }];
    }

    async run({ interaction }) {
        let command = interaction.options.getString('command');
        if (!command) {
            const embed = new MessageEmbed()
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
                .setTitle('• Help Menu')
                .setColor(this.client.color)
                .setDescription('Do /help [command] for a detailed help about that command')
                .addField('<:kongou_desu:545882696048443392> Info', this.client.interactions.commands.filter(cmd => cmd.category === 'Info').map(cmd => `/${cmd.name}`).join(', '))
                .addField('<:love_kongou:448387538617630751> Music', this.client.interactions.commands.filter(cmd => cmd.category === 'Music').map(cmd => `/${cmd.name}`).join(', '))
                .setFooter(`The Shipgirl Project • ${this.client.interactions.commands.size} commands loaded`);
            return interaction.reply({ embeds: [ embed ] });
        }
        command = this.client.interactions.commands.get(command);
        if (!command) 
            return interaction.reply('Teitoku, this command you specified don\'t exist');
        const embed = new MessageEmbed()
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
            .setTitle(`/${command.name}`)
            .setColor(this.client.color)
            .setDescription(command.description)
            .setFooter(`The Shipgirl Project • ${this.client.interactions.commands.size} commands loaded`);
        if (command.options?.length) {
            for (const option of command.options)
                embed.addField(`/${command.name} ${option.name}`, option.description);
        }
        return interaction.reply({ embeds: [ embed ] });
    }
}
module.exports = Ping;