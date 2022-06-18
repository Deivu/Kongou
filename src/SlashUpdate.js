const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');
const { token } = require('../config.json');
const { dev, clientId, guildId } = require('../slash-reloader-config');
console.log('• Loading the commands to refresh');
// the current amount of commands to refresh
const commands = [];
// peseudo load the commands to get the interaction data
for (const directory of readdirSync(`${__dirname}/interactions`, { withFileTypes: true })) {
    if (!directory.isDirectory()) continue;
    for (const command of readdirSync(`${__dirname}/interactions/${directory.name}`, { withFileTypes: true })) {
        if (!command.isFile()) continue;
        const Interaction = require(`${__dirname}/interactions/${directory.name}/${command.name}`);
        commands.push(new Interaction({}).interactionData);
    }
}
// stuffs are loaded, now lets log how many commands we have
console.log(`• Loaded ${commands.length} slash commands to refresh`);
// as per d.js guide, create a rest client
const rest = new REST({ version: '9' }).setToken(token);
// start the load up process
(async () => {
    try {
        console.log(`• Refreshing client "${clientId}" slash commands. Developer Mode? ${dev}`);
        if (dev) {
            // if dev mode is enabled, refresh commands on guild basis on the id of the guild you provided
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        } else {
            // else refresh globally
            await rest.put(Routes.applicationCommands(clientId), { body: commands });
        }
        console.log(`• Success! Refreshed client "${clientId}" slash commands`);
    } catch (error) {
        console.error(error);
    }
})();