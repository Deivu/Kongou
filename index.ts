import { GatewayIntentBits } from 'discord-api-types/v10';
import { Partials, Options } from 'discord.js';

import { Kongou } from './src/Kongou';
import { Manager } from './src/Manager';
import { Config } from './src/Utils';

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

// @ts-expect-error: ok
const manager = new Manager(options);

manager.start();
