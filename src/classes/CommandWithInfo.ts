import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

class CommandWithInfo {
    commandBuilder: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;

    constructor(commandBuilder: SlashCommandBuilder, execute: (interaction: ChatInputCommandInteraction) => Promise<void>) {
        this.commandBuilder = commandBuilder;
        this.execute = execute;
    }
}

export { CommandWithInfo };