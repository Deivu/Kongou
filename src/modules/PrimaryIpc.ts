import { Manager } from '../Manager.js';
import { IpcContent, IpcMessage } from '../Utils.js';

export class PrimaryIpc {
    public readonly manager: Manager;
    constructor(manager: Manager) {
        this.manager = manager;
        this.manager.indomitable.on('message', message => this.onMessage(message as IpcMessage));
    }

    private async onMessage(message: IpcMessage): Promise<void> {
        try {
            const content = message.content;
            if (content.op === 'ClientStatistics') {
                const stats = await this.broadcast({ op: content.op, data: content.data }, true);
                message.reply(stats);
            }
        } catch (error: unknown) {
            this.manager.logger.error(error);
            message.reply(null);
        }
    }

    public async send(id: number, content: IpcContent, repliable: boolean = false): Promise<unknown> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000).unref();
        return await this.manager.indomitable.ipc!.send(id,{ content, repliable, signal: controller.signal })
            .finally(() => clearTimeout(timeout));
    }

    public async broadcast(content: IpcContent, repliable: boolean = false): Promise<unknown> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000).unref();
        return await this.manager.indomitable.ipc!.broadcast({ content, repliable, signal: controller.signal })
            .finally(() => clearTimeout(timeout));
    }
}
