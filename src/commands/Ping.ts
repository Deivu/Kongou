import BaseCommand from "../base/BaseCommand";
import {Battleship} from "../../index";
import {Message} from "discord.js";

export default class Ping extends BaseCommand {
    constructor(client: Battleship) {
        super(client);

        this.name = "ping";
        this.category = "General";
        this.description = "Classic Ping command";
        this.usage = "ping";
    }

    public async exec(msg: Message, args: Array<string>): Promise<void> {
        await msg.channel.send(`The current ping to Discord Gateway is: **${Math.round(msg.guild.shard.ping)}ms**`);
    }
}
