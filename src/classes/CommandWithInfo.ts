import { ChatInputCommandInteraction, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

interface CommandInfo {
    name: string;
    toJSON: () => RESTPostAPIChatInputApplicationCommandsJSONBody
}

class CommandWithInfo {
    info: CommandInfo;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;

    constructor(
        info: CommandInfo,
        execute: (interaction: ChatInputCommandInteraction) => Promise<void>,
    ) {

        this.info = info;
        this.execute = execute;
    }
}

export { CommandWithInfo };