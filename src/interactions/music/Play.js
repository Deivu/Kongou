const { ApplicationCommandOptionType } = require('discord-api-types/v9');
const KongouInteraction = require('../../abstract/KongouInteraction.js');

class Play extends KongouInteraction {
    get name() {
        return 'play';
    }

    get description() {
        return 'Automatically fetches the video(s) and joins the voice channel you are in!';
    }
    
    get options() {
        return [{
            name: 'query',
            type: ApplicationCommandOptionType.String,
            description: 'The song you want to play',
            required: true,
        }];
    }

    get playerCheck() {
        return { voice: true, dispatcher: false, channel: false };
    }

    static checkURL(string) {
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    }

    async run({ interaction }) {
        await interaction.deferReply();
        const query = interaction.options.getString('query', true);
        const node = this.client.shoukaku.getNode();
        if (Play.checkURL(query)) {
            const result = await node.rest.resolve(query);
            if (!result?.tracks.length) 
                return interaction.editReply('Teitoku, I didn\'t find any song on the query you provided!');
            const track = result.tracks.shift();
            const playlist = result.loadType === 'PLAYLIST_LOADED';
            const dispatcher = await this.client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, track);
            if (dispatcher === 'Busy')
                return interaction.editReply('Teitoku, I\'m currently connecting to a voice channel');
            if (playlist) {
                for (const track of result.tracks) await this.client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, track);
            }   
            await interaction
                .editReply(playlist ? `Added the playlist \`${result.playlistInfo.name}\` in queue!` : `Added the track \`${track.info.title}\` in queue!`)
                .catch(() => null);
            dispatcher?.play();
            return;
        }
        const search = await node.rest.resolve(`ytsearch:${query}`);
        if (!search?.tracks.length)
            return interaction.editReply('Teitoku, I didn\'t find any song on the query you provided!');
        const track = search.tracks.shift();
        const dispatcher = await this.client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, track);
        if (dispatcher === 'Busy')
            return interaction.editReply('Teitoku, I\'m currently connecting to a voice channel');
        await interaction
            .editReply(`Added the track \`${track.info.title}\` in queue!`)
            .catch(() => null);
        dispatcher?.play();
    }
}
module.exports = Play;