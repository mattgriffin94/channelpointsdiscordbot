import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandWithInfo } from '../classes/CommandWithInfo';

function addPoints(): CommandWithInfo {
    const command = new SlashCommandBuilder()
        .setName('addPoints')
        .setDescription('Add points to a user in the database');

    async function execute(interaction: ChatInputCommandInteraction) {
        const stringReply = '';

        await interaction.reply(stringReply);
    }

    return new CommandWithInfo(command, execute);
}

export { addPoints };
