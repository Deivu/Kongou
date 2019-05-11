import {Battleship} from "../../index";

export default class Event {
    public client: Battleship;
    public name: string;

    constructor(client: Battleship) {
        this.client = client;
        this.name = "base";
    }

    public exec = async (): Promise<void> => {
        throw new Error('NOT_IMPLEMENTED: Go extend it you weebo');
    }
}
