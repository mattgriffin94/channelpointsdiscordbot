import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandWithInfo } from '../classes/CommandWithInfo';
import { client } from '../db/MongoManager';
import { ReturnDocument } from 'mongodb';

function createTallyCommandWithInfo(): CommandWithInfo {
    const command = new SlashCommandBuilder().setName('tally').setDescription('Updates and retrieves statistics for a specific name and outcome')
        .addStringOption(
            option =>
                option
                    .setName('name')
                    .setDescription('The name of the tally to adjust')
                    .setRequired(true),
        )
        .addStringOption(
            option =>
                option
                    .setName('outcome')
                    .setDescription('the outcome for the name')
                    .setRequired(true),
        )
        .addIntegerOption(
            option =>
                option
                    .setName('increment')
                    .setDescription('How much to adjust the tally.  Leave blank to read back current value')
                    .setRequired(false),
        );

    async function execute(interaction: ChatInputCommandInteraction) {
        try {

            // Get all the params specified by the user
            const name = interaction.options.getString('name');
            const outcome = interaction.options.getString('outcome');
            const incrementBy = interaction.options.getInteger('increment') || 0;
            // let incrementBy = interaction.options.getInteger('increment');
            // if (incrementBy === null || incrementBy === undefined) {
            //     incrementBy = 0;
            // }

            // set up the db and collection
            const database = client.db('discord');
            const collection = database.collection('keyValuePairs');

            let finalResult = 0;

            // Tell Mongo to Update the Key by the Increment
            const result = await collection.findOneAndUpdate(
                { key: name, outcome: outcome },
                { $inc: { value: incrementBy } },
                { upsert: true, returnDocument: ReturnDocument.AFTER },
            );

            // If we got a result back great! It means it already existed
            // if (result !== null) {
            //     finalResult = result.value;
            // }

            // Otherwise we need to actually create it
            // else {
            //     const data = { key: name, value: incrementBy };
            //     await collection.insertOne(data);
            //     finalResult = incrementBy;
            // }

            const totalOutcomes = await collection.aggregate([
                { $match: {key: name } },
                { $group: { _id: null, total: { $sum: "$value "}}}
            ]).next();

            const percentage = Math.round((result?.value / totalOutcomes?.total) * 100);

            // if (incrementBy != 0) {
            // eslint-disable-next-line max-len
            await interaction.reply(`The tally ${name} is ${outcome} ${result?.value} out of ${totalOutcomes?.total} times (${percentage}%)`)
                // await interaction.reply(`The tally *** ${name} *** was updated by *** ${incrementBy} *** and is now *** ${finalResult} ***`);
            // }
            // else {
                // await interaction.reply(`The tally ${name} is ${outcome} ${result?.value} out of ${totalOutcomes?.total} times (${percentage}%)`)
                // await interaction.reply(`The tally *** ${name} *** currently stands at *** ${finalResult} ***`);
            // }
        }
        catch (error) {
            console.error('Error processing tally:', error);
            await interaction.reply('There was a problem updating your tally');
        }
    }

    return new CommandWithInfo(command, execute);
}

export {
    createTallyCommandWithInfo,
};
