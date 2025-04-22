import { GatewayIntentBits } from 'discord-api-types/v10';
import { Partials, Options } from 'discord.js';

import { Kongou } from './dist/Kongou.js';
import { Manager } from './dist/Manager.js';
import { Config } from './dist/Utils.js';

const { Guilds, GuildMembers, GuildVoiceStates } = GatewayIntentBits;

const options = {
	clientOptions: {
		allowedMentions: { parse: [ 'users', 'roles' ]},
		partials: [ Partials.User, Partials.GuildMember ],
		intents: [ Guilds, GuildMembers, GuildVoiceStates ],
		makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings)
	},
	shardCount: Config.shards ?? undefined,
	clusterCount: Config.clusters ?? undefined,
	client: Kongou,
	clusterSettings: { execArgv: [ '--enable-source-maps' ]},
	autoRestart: true,
	handleConcurrency: false,
	spawnTimeout: 60000,
	token: Config.token
};

const manager = new Manager(options);

manager.start();
