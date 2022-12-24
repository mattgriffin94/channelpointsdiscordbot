import { Client, Collection, ClientOptions } from 'discord.js';
import { CommandWithInfo } from './CommandWithInfo';

class CommandClient extends Client {
    commands: Collection<string, CommandWithInfo>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
}

export { CommandClient };