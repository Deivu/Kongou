const KongouInteraction = require('../../abstract/KongouInteraction.js');
const Wait = require('util').promisify(setTimeout);

class Stop extends KongouInteraction {
    get name() {
        return 'stop';
    }

    get description() {
        return 'Stops the current playback!';
    }

    get playerCheck() {
        return { voice: true, dispatcher: true, channel: true };
    }

    async run({ interaction, dispatcher }) {
        await interaction.deferReply();
        dispatcher.queue.length = 0;
        dispatcher.stopped = true;
        dispatcher.player.stopTrack();
        Wait(500);
        await interaction.editReply('Teitoku, I stopped and destroyed the player in this guild!');
    }
}
module.exports = Stop;