
import BaseEvent from "./base/BaseEvent";
import {Battleship} from "../index";
import {Dirent} from "fs";

export class EventHandler {
    public client: Battleship;
    public listeners: Map<string, BaseEvent["exec"]>;

    constructor(client: Battleship) {
        this.client = client;
        this.listeners = new Map();
    }


    public async loadEvents(): Promise<void> {
        const events:Dirent[] = await this.client.promiseReaddir("./src/events");
        for (const event of events) {
            if (event.isDirectory()) continue;
            if (!event.name.endsWith(".js")) continue;
            const Handler = await import(`./events/${event.name}`);
            const Event:BaseEvent = new Handler.default(this.client);
            this.listeners.set(Event.name, Event.exec);
        }
    }

    public listenEvents(once:Array<String>): void {
        for (const [key, val] of this.listeners) {
            once.includes(key) ? this.client.once(key, val) :  this.client.on(key, val);
        }
    }
}
