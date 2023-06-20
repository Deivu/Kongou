import { Kongou } from '../Kongou.js';
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { InteractionContext } from './InteractionContext.js';

export interface CommandOptions {
    music?: {
        channel?: boolean; // checks if a user should be in a voice channel
        author?: boolean; // checks the author of the track is equal to the command invoker
        queue?: boolean; // checks if queue exists and is ready before proceeding
    },
    ensure?: {
        user?: boolean; // ensures the user is cached before proceeding on command
        member?: boolean; // ensures the member is cached before proceeding on command
    },
    defer?: boolean; // if we should defer a command
    owner?: boolean; // checks if the id of the user is included in owner ids
}

export abstract class Interaction {
    public readonly client: Kongou;
    public readonly directory: string;
    public abstract readonly commandData: RESTPostAPIChatInputApplicationCommandsJSONBody;
    public abstract readonly commandOptions: CommandOptions;
    protected constructor(client: Kongou, directory: string) {
        this.client = client;
        this.directory = directory;
    }

    abstract run(context: InteractionContext): Promise<void>;
}
