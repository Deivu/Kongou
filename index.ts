process.chdir("./out");

import {Client, ClientOptions} from "discord.js";
import { readdir, Dirent } from "fs";
import {EventHandler} from "./src/EventHandler";
import Config from "./config.json";

export class Battleship extends Client {
    public eventHandler: EventHandler;

    constructor(options:ClientOptions) {
        super(options);
        this.eventHandler = new EventHandler(this);
    }

    public async build(): Promise<void> {
        await this.eventHandler.loadEvents();
        this.eventHandler.listenEvents(["ready"]);
    }

    public promiseReaddir(path:string): Promise<Dirent[]> {
        return new Promise((resolve, reject) => {
            readdir(path, { withFileTypes: true }, (error:any, entries:Dirent[]) => {
                error ? reject(error) : resolve(entries);
            })
        })
    }
}

const Kongou:Battleship = new Battleship({});
Kongou.build()
    .then(() => {
        Kongou.login(Config.token);
    });
