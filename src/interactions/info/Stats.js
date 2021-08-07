const { MessageEmbed } = require('discord.js');
const KongouInteraction = require('../../abstract/KongouInteraction.js');

class Stats extends KongouInteraction {
    get name() {
        return 'stats';
    }

    get description() {
        return 'My current info!';
    }

    static convertBytes(bytes) {
        const MB = Math.floor(bytes / 1024 / 1024 % 1000);
        const GB = Math.floor(bytes / 1024 / 1024 / 1024);
        if (MB >= 1000) 
            return `${GB.toFixed(1)} GB`;
        else 
            return `${Math.round(MB)} MB`;
    }

    async run({ interaction }) {
        const [ guilds, channels, memory, players ] = await Promise.all([
            this.client.shard.broadcastEval('this.guilds.cache.size'),
            this.client.shard.broadcastEval('this.channels.cache.size'),
            this.client.shard.broadcastEval('process.memoryUsage()'),
            this.client.shard.broadcastEval('this.queue.size')
        ]);
        const embed = new MessageEmbed()
            .setColor(this.client.color)
            .setTitle('Status')
            .setDescription(`\`\`\`ml\n
Guilds   :: ${guilds.reduce((sum, count) => sum + count)}
Channels :: ${channels.reduce((sum, count) => sum + count)}
Players  :: ${players.reduce((sum, count) => sum + count)}
Memory   :: ${Stats.convertBytes(memory.reduce((sum, memory) => sum + memory.rss, 0))}\`\`\``)
            .setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL());
        await interaction.reply({ embeds: [ embed ] });
    }
}
module.exports = Stats;