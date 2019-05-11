import {Client} from "discord.js";

export class EventHandler {
    public client: Client;
    public emitters: Map<>;

    constructor(client:Client) {
        this.client = client;
    }

    loadEvents()
}
