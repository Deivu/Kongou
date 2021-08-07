
const KongouInteraction = require('../../abstract/KongouInteraction.js');

class Shuffle extends KongouInteraction {
    get name() {
        return 'shuffle';
    }

    get description() {
        return 'Shuffles the current queue of songs!';
    }

    get playerCheck() {
        return { voice: true, dispatcher: true, channel: true };
    }

    async run({ interaction, dispatcher }) {
        dispatcher.queue = dispatcher.queue.sort(() => Math.random() - 0.5);
        await interaction.reply('Teitoku, I succesfully shuffled the queue in this guild!');
    }
}
module.exports = Shuffle;