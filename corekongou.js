const { Client } = require('eris');
const Enmap = require('enmap');
const YoutubeAPI = require('simple-youtube-api');
const Fs = require('fs'); 
const Config = require('./config.json');
const CommandHandler = require('./src/modules/commandHandler.js');
const ErrorHandler = require('./modules/cannons.js');

class BattleCruiser extends Client {
	constructor(token, settings) {
		super(token, settings);
		this.misc = require('./misc.json');
		this.ytdl = require('ytdl-core');
		this.cannons = new ErrorHandler(this);
		this.handler = new CommandHandler(this);
		this.youtube = new YoutubeAPI(Config.ytkey);
		this.unavailable = new Set();
		this.persistence = new Enmap({ name: 'config', autoFetch: 'true', fetchAll: false });
		this.commands = new Map();
		this.queue = new Map();
	};

    CacheCommand(name, path) {
    	const cache = new (require(path))(this);
    	this.commands.set(name, cache);
    };

	GetCommands() {
		for (const file of fs.readdirSync('./src/commands')) {
			this.CacheCommand(file.split('.')[0], `./src/commands/${file}`);
		};
	};

	Sortie() {
		this.GetCommands();
		this.connect();

		this.on('ready', () => console.log('Admiral, 1st of the Kongou Class Battle Cruisers, Kongou is now Ready to Go !'));
		this.on('error', (error) => this.cannons(this, error).fire());
		this.on('connect', (id) => console.log(`Admiral, My Shard #${id} Initialized Freely !`);
		this.on('messageCreate', (msg) => {
			if (msg.author.bot || !msg.content.startsWith(this.misc.prefix)) return;
			if (msg.channel.guild.members.get(this.user.id).permission.has('sendMessages')) {
				this.handler.run(msg);
		    };
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