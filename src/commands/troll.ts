import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandWithInfo } from '../classes/CommandWithInfo';

function createTrollerCommandWithInfo(): CommandWithInfo {
    const commandBuilder = new SlashCommandBuilder().setName('trollify').setDescription('Trollifies the message with GPT-3');

    async function execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('troller dog lmoa');
    }

    return new CommandWithInfo(commandBuilder, execute);
}

export {
    createTrollerCommandWithInfo,
};
