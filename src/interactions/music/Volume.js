const { ApplicationCommandOptionType } = require('discord-api-types/v9');
const KongouInteraction = require('../../abstract/KongouInteraction.js');

class Volume extends KongouInteraction {
    get name() {
        return 'volume';
    }

    get description() {
        return 'Sets the volume of this playback.';
    }
    
    get options() {
        return [{
            name: 'value',
            type: ApplicationCommandOptionType.Integer,
            description: 'The new volume you want me to set to [1-200]',
            required: true,
        }];
    }

    get playerCheck() {
        return { voice: true, dispatcher: true, channel: true };
    }

    static inRange(x, min, max) {
        return (x - min) * ( x - max) <= 0;
    }
    
    async run({ interaction, dispatcher }) {
        let volume = interaction.options.getInteger('value', true);
        if (!Volume.inRange(volume, 1, 200)) volume = 30;
        dispatcher.player.setVolume(volume / 100);
        await interaction.reply(`The playback volume is now set to \`${volume}%\``);
    }
}
module.exports = Volume;