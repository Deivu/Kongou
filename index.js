const Battleship = require('./src/Kongou.js');
const config = require('./config.json');
const Kongou = new Battleship()
Kongou.build({
    messageCacheMaxSize: 1,
    disabledEvents: ['CHANNEL_PINS_UPDATE', 'GUILD_BAN_ADD', 'GUILD_BAN_REMOVE', 'RELATIONSHIP_ADD', 'RELATIONSHIP_REMOVE', 'TYPING_START', 'PRESENCE_UPDATE', 'GUILD_EMOJIS_UPDATE']
});
Kongou.login(config.token);