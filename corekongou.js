const { Client } = require('eris');
const Enmap = require('enmap');
const YoutubeAPI = require('simple-youtube-api');
const Fs = require('fs'); 
const Config = require('./config.json');
const CommandHandler = require('./src/modules/commandhandler.js');
const ErrorHandler = require('./src/modules/cannons.js');

class BattleCruiser extends Client {
	constructor(token, settings) {
		super(token, settings);
		this.misc = require('./misc.json');
		this.ytdl = require('ytdl-core-discord');
		this.cannons = new ErrorHandler(this);
		this.handler = new CommandHandler(this);
		this.youtube = new YoutubeAPI(Config.googletoken);
		this.unavailable = new Set();
		this.ratelimit = new Set();
		this.persistence = new Enmap({ name: 'config', autoFetch: true, fetchAll: false });
		this.commands = new Map();
		this.queue = new Map();
	};
	
	GetCommands() {
		for (const file of Fs.readdirSync('./src/commands')) {
			this.commands.set(file.split('.')[0], (new (require(`./src/commands/${file}`))(this)));
		};
	};

	Sortie() {
		this.on('ready', () => {
			this.editStatus('online', { name: 'with the Admiral.'});
			console.log(`Admiral, Kongou is now Operational with ${this.guilds.size} Port(s) Accessible.`);
		});
		this.on('connect', (id) => console.log(`Admiral, Module Shard #${id} is now Operational.`));
		this.on('shardDisconnect', (error) => console.log(`Admiral, a shard disconnected due to ${error}`));
		this.on('error', (error) => this.cannons.fire(error));
		this.on('guildUnavailable', (guild) => this.unavailable.add(guild.id));
		this.on('guildAvailable', (guild) => this.unavailable.delete(guild.id));

		this.on('guildCreate', (guild) => {
			console.log(`New Guild Admiral, ${guild.name}`);
		});
		this.on('guildRemove', (guild) => {
			console.log(`Some Fool Removed me Admiral, ${guild.name}`);
		});
		this.on('messageCreate', (msg) => {
			if (msg.author.bot || msg.channel.type !== 0 || !msg.content.startsWith(this.misc.prefix) || this.unavailable.has(msg.channel.guild.id)) return;
			if (msg.channel.guild.members.get(this.user.id).permission.has('sendMessages')) {
				this.ratelimit.add(msg.author.id);
				setTimeout(() => this.ratelimit.delete(msg.author.id), 1500);
				this.handler.run(msg)
				.catch(error => {
			        this.Kongou.cannons.fire(error);
		        });
		    };
		});

		this.GetCommands();
		this.connect();
	};
};

const Kongou = new BattleCruiser(Config.token, { compress: true, defaultImageFormat: 'webp', defaultImageSize: 256 });

Kongou.Sortie();