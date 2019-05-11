import BaseEvent from "../base/BaseEvent";
import {Battleship} from "../../index";

export default class Ready extends BaseEvent {
    constructor(client: Battleship) {
        super(client);
        this.name = "ready";
    }

    public exec = async (): Promise<void> => {
        console.log(`${this.client.user ? this.client.user.username : "Bot"} is now online.`);
    }
}
