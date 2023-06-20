import Pino from 'pino';
import Cluster from 'cluster';
import Fs from 'fs';
import { NodeOption } from 'shoukaku';

export interface IpcContent {
    op: string;
    data?: unknown;
}

export interface IpcMessage {
    reply: (data: unknown) => void;
    content: IpcContent;
    repliable: boolean;
}

export interface UpdateCommandsOptions {
    guildId?: string;
    clear?: boolean;
}

export interface ClientStatistics {
    guilds: number;
    users: number;
    channels: number;
    players: number;
    shards: number;
    ram: number;
}

export interface ConfigOptions {
    level: string;
    owners: string[];
    token: string;
    shards: number|null;
    clusters: number|null;
    slashOptions: {
        update: boolean;
        dev: boolean;
        clear: boolean;
        guildId: string;
    }
}

export const IndomitableEnvVariables = {
    clusterId: Number(process.env.INDOMITABLE_CLUSTER),
    clusterTotal: Number(process.env.INDOMITABLE_CLUSTER_TOTAL)
};

export const Colors = {
    Normal: 0x7E686C,
    Fail: 0xFF7276
};

export const Config: ConfigOptions = JSON.parse(Fs.readFileSync('./Config.json', { encoding: 'utf-8' }));

export const Lavalink: NodeOption[] = JSON.parse(Fs.readFileSync('./Lavalink.json', { encoding: 'utf-8' }));

/*
 * Refer to https://github.com/Deivu/Shoukaku#shoukakus-options for available options
 */
export const ShoukakuOptions = {};

// @ts-expect-error
export const Logger = Pino(Cluster.isPrimary ? {
    name: `Primary [ID: ${process.pid}]`,
    level: Config.level
} : {
    name: `Cluster [ID: ${Number(process.env.INDOMITABLE_CLUSTER)}]`,
    level: Config.level
}, Pino.destination({ sync: false }));

export const KongouAsciiArt = '\n' +
    '                                                                     \n' +
    '       ,--.                                                          \n' +
    '   ,--/  /|                                                          \n' +
    ',---,\': / \'                                                          \n' +
    ':   : \'/ /    ,---.        ,---,               ,---.           ,--,  \n' +
    '|   \'   ,    \'   ,\'\\   ,-+-. /  |  ,----._,.  \'   ,\'\\        ,\'_ /|  \n' +
    '\'   |  /    /   /   | ,--.\'|\'   | /   /  \' / /   /   |  .--. |  | :  \n' +
    '|   ;  ;   .   ; ,. :|   |  ,"\' ||   :     |.   ; ,. :,\'_ /| :  . |  \n' +
    ':   \'   \\  \'   | |: :|   | /  | ||   | .\\  .\'   | |: :|  \' | |  . .  \n' +
    '|   |    \' \'   | .; :|   | |  | |.   ; \';  |\'   | .; :|  | \' |  | |  \n' +
    '\'   : |.  \\|   :    ||   | |  |/ \'   .   . ||   :    |:  | : ;  ; |  \n' +
    '|   | \'_\\.\' \\   \\  / |   | |--\'   `---`-\'| | \\   \\  / \'  :  `--\'   \\ \n' +
    '\'   : |      `----\'  |   |/       .\'__/\\_: |  `----\'  :  ,      .-./ \n' +
    ';   |,\'              \'---\'        |   :    :           `--`----\'     \n' +
    '\'---\'                              \\   \\  /                          \n' +
    '                                    `--`-\'                           \n';
/*
 * https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
 */
export function ParseSize (bytes: number, si: boolean = false, decimals: number = 1): string {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = si
        ? [ 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ]
        : [ 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB' ];
    let u = -1;
    const r = 10**decimals;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
    return `${bytes.toFixed(decimals)} ${units[u]}`;
}

export function Paginate<T>(array: T[], page: number, limit: number): T[] {
    const duplicate = array.slice();
    const start = (page - 1) * limit;
    return duplicate.length > limit ? duplicate.slice(start, start + limit) : duplicate;
}

export function Shuffle<T>(array: T[]): T[] {
    const duplicate = array.slice();
    for (let length = duplicate.length - 1; length > 0; length--) {
        const random = Math.floor(Math.random() * (length + 1));
        [ array[length], array[random] ] = [ array[random], array[length] ];
    }
    return duplicate;
}

export function AddZero(time: number): string {
    return time < 10 ? `0${time}` : time.toString();
}

export function ReadableTime(ms: number): string {
    const date = new Date(ms);
    return `${AddZero(date.getMinutes())}:${AddZero(date.getSeconds())}`;
}

if (Cluster.isPrimary) {
    Logger.info!('Starting....');
    Logger.info!(KongouAsciiArt);
}
