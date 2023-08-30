import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandWithInfo } from '../classes/CommandWithInfo';

function createTallyCommandWithInfo(): CommandWithInfo {
    const command = new SlashCommandBuilder().setName('tally').setDescription('Increases the tally')
        .addStringOption(option => option.setName('name').setDescription('The name of the tally to adjust').setRequired(true))
        .addStringOption(option => option.setName('increment').setDescription('How much to adjust the tally.  Leave blank to read back current value').setRequired(false));

    async function execute(interaction: ChatInputCommandInteraction) {
        
        await interaction.reply("hello from tally");
    }

    return new CommandWithInfo(command, execute);
}

export {
    createTallyCommandWithInfo,
};
