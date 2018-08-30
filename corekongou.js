const { Client } = require('eris');
const Enmap = require('enmap');
const YoutubeAPI = require('simple-youtube-api');
const Fs = require('fs'); 
const Config = require('./config.json');
const CommandHandler = require('./src/modules/commandHandler.js');

class BattleCruiser extends Client {
	constructor(token, settings) {
		super(token, settings);
		this.misc = require('./misc.json');
		this.cannons = require('./modules/cannons.js');
		this.ytdl = require('ytdl-core');
		this.youtube = new YoutubeAPI(Config.ytkey);
		this.persistence = new Enmap({ name: 'config', autoFetch: 'true', fetchAll: false });
		this.unavailable = new Set();
		this.commands = new Map();
		this.queue = new Map();
	};

	LoadCommands() {
		for (const file of fs.readdirSync('./src/commands')) {
			this.commands.set(file.split('.')[0], require(`./src/commands/${file}`));
		};
	};

	Sortie() {
		this.LoadCommands();
		this.connect();

		this.on('ready', () => console.log('Admiral, 1st of the Kongou Class Battle Cruisers, Kongou is now Ready to Go !'));
		this.on('error', (error) => this.cannons(this, error).fire());
		this.on('connect', (id) => console.log(`Admiral, My Shard #${id} Initialized Freely !`);
		this.on('messageCreate', (msg) => {
			CommandHandler(this, msg).run()
			.catch(error => {
				this.cannons(this, error).fire();
				msg.channel.createMessage(`Admiral, I encountered an Unexpected Error, Here is the report.\`\`\`${error.stack}\`\`\``);
			});
		});
		this.on('guildCreate', (guild) => {
			console.log(`New Guild Admiral, ${guild.name}`);
		});
		this.on('guildRemove', (guild) => {
			console.log(`Some Fool Removed me Admiral, ${guild.name}`);
		});
		this.on('guildUnavailable', (guild) => this.unavailable.add(guild.id));
		this.on('guildAvailable', (guild) => this.unavailable.delete(guild.id));
	};
};

const Kongou = new BattleCruiser(Config.token, { compress: true, defaultImageFormat: 'webm', defaultImageSize: 256 });

Kongou.Sortie();