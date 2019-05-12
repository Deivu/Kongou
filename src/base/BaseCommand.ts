import {Battleship} from "../../index";
import {Message, PermissionResolvable} from "discord.js";

interface Options {
    ownerOnly?: Boolean,
    perms?: PermissionResolvable,
}

export default class BaseCommand {
    public client: Battleship;
    public name: string;
    public category: string;
    public description: string;
    public usage: string;
    public options?: Options;

    constructor(client: Battleship) {
        this.client = client;
        this.name = "base";
        this.category = "base";
        this.description = "Base Class to Extend for commands";
        this.usage = "Extend this";
    }

    public async exec(msg: Message, args: Array<string>): Promise<void> {
        throw new Error("NOT_IMPLEMENTED: Go extend it you weebo");
    }
}
