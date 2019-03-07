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
		this.ytdl = require('ytdl-core');
		this.cannons = new ErrorHandler(this);
		this.handler = new CommandHandler(this);
		this.youtube = new YoutubeAPI(Config.googletoken);
		this.unavailable = new Set();
		this.ratelimit = new Set();
		this.persistence = new Enmap({ name: 'config', autoFetch: true, fetchAll: false });
		this.commands = new Map();
		this.queue = new Map();
	};

	loadCommands() {
		for (const file of Fs.readdirSync('./src/commands')) {
			this.commands.set(file.split('.')[0], (new (require(`./src/commands/${file}`))(this)));
        }
    };

	Sortie() {
		this.on('ready', () => {
			this.editStatus('online', { name: 'Just booted up ...'});
			setInterval(() => {
				const time = this.getUptime();
				this.editStatus('online', { name: `with Saya for ${time.days} : ${time.hours}`})
			}, 60000);
			console.log(`Admiral, Kongou is now Operational with ${this.guilds.size} Port(s) Accessible.`);
		});
		this.on('error', this.cannons.fire);
		this.on('guildUnavailable', (guild) => this.unavailable.add(guild.id));
		this.on('guildAvailable', (guild) => this.unavailable.delete(guild.id));
		this.on('guildCreate', (guild) => {
			this.persistence.set(guild.id, { prefix: this.misc.prefix });
			console.log(`New guild joined: ${guild}`);
		});
		this.on('guildRemove', (guild) => {
			this.persistence.delete(guild.id);
			console.log(`Removed guild: ${guild.name}`);
		});
		this.on('messageCreate', (msg) => {
			let settings = this.persistence.get(msg.channel.guild.id);
			if (!settings) settings = this.persistence.set(msg.channel.guild.id, { prefix: this.misc.prefix }).get(msg.channel.guild.id);
			if (msg.author.bot || msg.channel.type !== 0 || this.unavailable.has(msg.channel.guild.id)) return;
			if (msg.channel.guild.members.get(this.user.id).permission.has('sendMessages')) {
				if (!this.mentionregex) this.mentionregex = new RegExp(`^<@!?${this.user.id}>`);
				if (this.ratelimit.has(msg.author.id)) return;
				this.ratelimit.add(msg.author.id);
				setTimeout(() => this.ratelimit.delete(msg.author.id), 1250);
				if (msg.content.match(this.mentionregex)) {
					if (msg.content.split(' ').length === 1) {
						msg.channel.createMessage(`Seems like you forgot my prefix Admiral. The prefix in this server is **${settings.prefix}**`).catch(this.cannons.fire);
					    return;
                    }
                }
                if (msg.content.startsWith(settings.prefix)) this.handler.run(msg, settings).catch(this.cannons.fire);
            }
        });

		this.loadCommands();
		this.connect().catch(console.error)
	};

	getUptime() {
		const ms = Math.floor(process.uptime() * 1000);
		const h = (ms / 3600000 % 24).toFixed(2);
		const da = (ms /(1000*60*60*24)).toFixed(1);
		return {
			hours: Math.floor(h) <= 1 ? `${h} hour` : `${h} hours`,
			days: Math.floor(da) <= 1 ? `${da} day` : `${da} days`,
		};
	};
}

const Kongou = new BattleCruiser(Config.token, { compress: true, defaultImageFormat: 'webp', defaultImageSize: 256 });

Kongou.Sortie()