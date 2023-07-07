import Cluster from 'cluster';
import { BaseLogger } from 'pino';
import { clearInterval } from 'timers';
import { Indomitable, IndomitableOptions } from 'indomitable';
import { PrimaryIpc } from './modules/PrimaryIpc.js';
import { Logger, Config, ClientStatistics, ParseSize } from './Utils.js';

export interface Timers {
    activity?: NodeJS.Timer;
}

export class Manager {
    public readonly logger: BaseLogger;
    public readonly indomitable: Indomitable;
    public readonly ipc: PrimaryIpc;
    private timers: Timers;
    constructor(options: IndomitableOptions) {
        this.logger = Logger;
        this.indomitable = new Indomitable(options);
        this.ipc = new PrimaryIpc(this);
        this.timers = {};

        this.indomitable
            .on('error', error => this.logger.error(error))
            .on('debug', message => this.logger.debug(message))
            .on('workerReady', async (cluster) => {
                try {
                    // check if we are ready
                    if (this.checkWorkersReady()) {
                        if (this.timers.activity) clearInterval(this.timers.activity);
                        this.timers.activity = setInterval(async () => {
                            try {
                                const results = await this.ipc.broadcast({ op: 'ClientStatistics' }, true) as ClientStatistics[];
                                const statistics = { channels: 0,  guilds: 0,  players: 0,  ram: 0,  shards: 0,  users: 0 };
                                results.map(result => {
                                    for (const key of Object.keys(result))
                                        // @ts-expect-error
                                        statistics[key] += result[key];
                                });
                                await this.ipc.broadcast({ op: 'ActivityUpdate', data: `/help | using ${ParseSize(statistics.ram)}` });
                            } catch (error) {
                                this.logger.error(error);
                            }
                        },
                        300000
                        ).unref();
                    }
                    this.logger.info(`Spawned Cluster Id: ${cluster.id} | Remaining ${this.indomitable.inSpawnQueueCount} cluster(s) to spawn`);
                    await this.ipc
                        .broadcast({ op: 'ActivityUpdate', data: `/help | Spawned ${cluster.id + 1}/${this.indomitable.clusters!.size} cluster(s)` })
                        .catch(() => null);
                    if (cluster.id === 0 && Config.slashOptions.update) {
                        this.logger.info(`Slash commands will be updated. Will update in dev mode (guild)? ${Config.slashOptions.dev}. Will clear? ${Config.slashOptions.clear}`);
                        if (Config.slashOptions.guildId && Config.slashOptions.dev)
                            await this.ipc.send(cluster.id, { op: 'SlashCommandsUpdate', data: { guildId: Config.slashOptions.guildId, clear: Config.slashOptions.clear }});
                        else if (!Config.slashOptions.dev)
                            await this.ipc.send(cluster.id, { op: 'SlashCommandsUpdate', data: { clear: Config.slashOptions.clear }});
                        else
                            this.logger.warn('Requested to update slash commands, but can\'t due to invalid config');
                    }
                } catch (error) {
                    this.logger.error(error);
                }
            });
    }

    public checkWorkersReady(): boolean {
        if (!Cluster.isPrimary) return false;
        let clustersReady = 0;
        for (const cluster of this.indomitable.clusters!.values()) {
            if (!cluster.ready) continue;
            clustersReady += 1;
        }
        return clustersReady === this.indomitable.clusters!.size;
    }

    public async start(): Promise<void> {
        this.logger.info('Start command received. Spawning...');
        await this.indomitable.spawn();
    }
}
