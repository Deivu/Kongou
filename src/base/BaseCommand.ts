import {Battleship} from "../../index";
import {Message, PermissionResolvable} from "discord.js";

interface Options {
    ownerOnly?: Boolean,
    perms?: PermissionResolvable,
}

export default class BaseCommand {
    public client: Battleship;
    public name: String;
    public category: String;
    public description: String;
    public usage: String;
    public options?: Options;

    constructor(client: Battleship) {
        this.client = client;
        this.name = "base";
        this.category = "base";
        this.description = "Base Class to Extend for commands";
        this.usage = "Extend this";
    }

    async exec(msg: Message, args: Array<String>): Promise<void> {
        throw new Error("NOT_IMPLEMENTED: Go extend it you weebo");
    }
}
