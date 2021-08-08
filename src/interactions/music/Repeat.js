const { ApplicationCommandOptionType } = require('discord-api-types/v9');
const KongouInteraction = require('../../abstract/KongouInteraction.js');

class Skip extends KongouInteraction {
    get name() {
        return 'repeat';
    }

    get description() {
        return 'Sets the repeat mode of this playback';
    }

    get options() {
        return [{
            name: 'one',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Repeats the currently playing track',
        }, {
            name: 'all',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Repeats the whole queue',
        }, {
            name: 'off',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Disables the repeat playback mode',
        }];
    }

    get playerCheck() {
        return { voice: true, dispatcher: true, channel: true };
    }

    async run({ interaction, dispatcher }) {
        dispatcher.repeat = interaction.options.getSubcommand(true);
        await interaction.reply(`Teitoku, the repeat playback mode is now set to \`${dispatcher.repeat}\`!`);
    }
}
module.exports = Skip;