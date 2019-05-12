import {EventEmitter} from 'events';
import {Dirent} from "fs";
import {Collection, Message} from "discord.js";
import {Battleship} from "../index";
import BaseCommand from "./base/BaseCommand";

interface KongouCommandHandlerOptions {
    owners?: Array<string>,
    defaultPrefix?: string,
    globalCooldown?: number,
    ignoreBots?: boolean
}

export class CommandHandler extends EventEmitter {
    public client: Battleship;
    public options: KongouCommandHandlerOptions;
    public modules: Collection<string, BaseCommand>;
    private cooldown: Set<string>;
    private initialized: boolean;

    constructor(client: Battleship, options: KongouCommandHandlerOptions) {
        super();
        this.client = client;
        this.options = {
            owners: options.owners || [],
            defaultPrefix: options.defaultPrefix || "!",
            globalCooldown: options.globalCooldown || 1,
            ignoreBots: options.ignoreBots || true
        };
        this.modules = new Collection();
        this.initialized = false;
        this.cooldown = new Set();
    }

    public async loadCommands(): Promise<void> {
        const commands:Dirent[] = await this.client.promiseReaddir("./src/commands");
        for (const event of commands) {
            if (event.isDirectory()) continue;
            if (!event.name.endsWith(".js")) continue;
            const Handler = await import(`./commands/${event.name}`);
            const Command:BaseCommand = new Handler.default(this.client);
            this.modules.set(Command.name, Command);
        }
    }

    public listenCommands(): void {
        if (this.initialized)
            throw new Error("CommandHandler is already initialized");
        this.client.on("message", this.handle);
        this.initialized = true;
    }

    private handle = async (msg: Message): Promise<void> => {
        try {
            if (this.options.ignoreBots && msg.author.bot) return;
            if (!msg.content.startsWith(this.options.defaultPrefix)) return;
            const query:string = msg.content.slice(this.options.defaultPrefix.length).split(" ")[0];
            const Command:BaseCommand = this.modules.get(query);
            if (!Command) return;
            if (this.checkcooldown(msg.author.id)) {
                this.emit("cooldown", msg);
                return;
            }
            const args:Array<string> = msg.content.slice(this.options.defaultPrefix.length + Command.name.length).split(" ");
            await Command.exec(msg, args);
        } catch (error) {
            this.emit("error", error);
        }
    }

    private checkcooldown(id:string): Boolean {
        if (this.cooldown.has(id)) return true;
        this.cooldown.add(id);
        this.client.setTimeout(() => this.cooldown.delete(id), this.options.globalCooldown * 1000);
        return false;
    }
}
