
import BaseEvent from "./base/BaseEvent";
import {Battleship} from "../index";
import {Dirent} from "fs";

export class EventHandler {
    public client: Battleship;
    public listeners: Map<string, BaseEvent["exec"]>;
    private initialized: boolean;

    constructor(client: Battleship) {
        this.client = client;
        this.listeners = new Map();
        this.initialized = false;
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

    public listenEvents(once: Array<string>): void {
        if (this.initialized)
            throw new Error("EventHandler is already initialized");
        for (const [key, val] of this.listeners) {
            once.includes(key) ? this.client.once(key, val) :  this.client.on(key, val);
        }
        this.initialized = true;
    }
}
