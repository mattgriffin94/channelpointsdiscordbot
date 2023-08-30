import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandWithInfo } from '../classes/CommandWithInfo';
import { client } from '../db/MongoManager';
import { ReturnDocument } from 'mongodb';

function createTallyCommandWithInfo(): CommandWithInfo {
    const command = new SlashCommandBuilder().setName('tally').setDescription('Increases the tally')
        .addStringOption(option => option.setName('name').setDescription('The name of the tally to adjust').setRequired(true))
        .addIntegerOption(option => option.setName('increment').setDescription('How much to adjust the tally.  Leave blank to read back current value').setRequired(false));

    async function execute(interaction: ChatInputCommandInteraction) {
        try {

            // Get all the params specified by the user
            const name = interaction.options.getString('name');
            var incrementBy = interaction.options.getInteger('increment');
            if (incrementBy === null || incrementBy === undefined) {
                incrementBy = 0;
            }

            // set up the db and collection
            const database = client.db('discord');
            const collection = database.collection('keyValuePairs');

            var finalResult = 0;
    
            // Tell Mongo to Update the Key by the Increment
            const result = await collection.findOneAndUpdate(
                { key: name },
                { $inc: { value: incrementBy } },
                { returnDocument: ReturnDocument.AFTER }
            );

            // If we got a result back great! It means it already existed
            if (result !== null) {
                finalResult = result.value.value;
            } 
            
            // Otherwise we need to actually create it
            else {
                const data = { key: name, value: incrementBy };
                await collection.insertOne(data);
                finalResult = incrementBy;
            }

            await interaction.reply(`hello from tally ${result}`);
        } catch (error) {
            console.error('Error incrementing number:', error);
        }
        
        await interaction.reply("hello from tally");
    }

    return new CommandWithInfo(command, execute);
}

export {
    createTallyCommandWithInfo,
};
