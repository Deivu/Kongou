import { ShardClientUtil } from 'indomitable';
import { Kongou } from '../Kongou.js';
import { IpcContent, IpcMessage, UpdateCommandsOptions } from '../Utils.js';

export class ClientIpc {
    public readonly client: Kongou;
    private ready: boolean;
    constructor(client: Kongou) {
        this.client = client;
        this.ready = false;
    }

    get shard(): ShardClientUtil {
        return this.client.shard as unknown as ShardClientUtil;
    }

    private async onMessage(message: IpcMessage): Promise<void> {
        try {
            const content = message.content;
            switch(content.op) {
                case 'SlashCommandsUpdate':
                    await this.client.interactions.updateClientCommands(content.data as UpdateCommandsOptions);
                    break;
                case 'ClientStatistics':
                    message.reply(this.client.getClientStatistics());
                    break;
                case  'ActivityUpdate':
                    this.client.user!.setActivity(content.data as string);
            }
        } catch (error: unknown) {
            this.client.logger.error(error);
            message.reply(null);
        }
    }

    public async send(content: IpcContent, repliable: boolean = false): Promise<unknown> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000).unref();
        return await this.shard
            .send({ content, repliable, signal: controller.signal })
            .finally(() => clearTimeout(timeout));
    }

    public listen(): void {
        if (this.ready) return;
        this.shard.on('message', message => this.onMessage(message as IpcMessage));
        this.ready = true;
    }
}
