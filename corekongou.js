const { Client } = require('eris');
const Enmap = require('enmap');
const YoutubeAPI = require('simple-youtube-api');
const Fs = require('fs'); 
const Config = require('./config.json');

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

		this.on('ready', () => {});
		this.on('error', (error) => {});
		this.on('connect', (id) => {});
		this.on('messageCreate', (msg) => {});
		this.on('guildCreate', (guild) => {});
		this.on('guildRemove', (guild) => {});
		this.on('guildUnavailable', (guild) => this.unavailable.add(guild.id));
		this.on('guildAvailable', (guild) => this.unavailable.delete(guild.id));
	};
};

const Kongou = new BattleCruiser(Config.token, { compress: true, defaultImageFormat: 'webm', defaultImageSize: 256 });

Kongou.Sortie();