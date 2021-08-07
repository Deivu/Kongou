const { MessageEmbed } = require('discord.js');
const { ApplicationCommandOptionType } = require('discord-api-types/v9');
const { inspect } = require('util');
const KongouInteraction = require('../../abstract/KongouInteraction.js');

class Eval extends KongouInteraction {
    get name() {
        return 'eval';
    }

    get description() {
        return 'Teitoku, stop inspecting my cannons >3<';
    }

    get permissions() {
        return 'OWNER';
    }

    get options() {
        return [{
            name: 'code',
            type: ApplicationCommandOptionType.String,
            description: 'The code you want me to evaluate',
            required: true,
        }];
    }

    static trim(string, max) {
        return string.length > max ? string.slice(0, max) : string;
    }

    async run({ interaction }) {
        await interaction.deferReply();
        const code = interaction.options.getString('code', true);
        let res;
        try {
            res = eval(code);
            res = inspect(res, { depth: 0 });
        } catch (error) {
            res = inspect(error, { depth: 0 });
        }
        const embed = new MessageEmbed()
            .setColor(this.client.color)
            .setTitle('Eval Results')
            .setDescription(`\`\`\`js\n${Eval.trim(res, 2000)}\`\`\``)
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL());
        await interaction.editReply({ embeds: [ embed ] });
    }
}
module.exports = Eval;