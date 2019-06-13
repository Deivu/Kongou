const Kongou = require('./src/Kongou.js');
const Config = require('./src/config.json');

const client = new Kongou({ messageCacheMaxSize	: 5 });

client.build();
client.login(Config.token);