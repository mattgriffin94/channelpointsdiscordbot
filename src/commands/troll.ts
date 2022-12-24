import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CommandWithInfo } from '../classes/CommandWithInfo';
import { Configuration, OpenAIApi } from 'openai';

// eslint-disable-next-line max-len
const prompt = 'There\'s an online video game community who like to semi-affectionately call each other "Troller Dogs".  A "troller dog" is someone who trolls and is generally a goofy idiot.  Your task is: given a message, convert it into a message that would be suitable for this online community be adding in references to "trolling", "troller dogs", and "troller doglets."\n\nInput: any droppers in chat?\nOutput: any troller dogs down to troll?\n\nInput: john is too happy for a 3rd place performance\nOutput: troller dog john is trolling.  way too happy for a troll 3rd place.\n\nInput: im also down for mario kart instead if you want, sherry\nOutput: im also down to troll some mario kart instead if you want, troller doglet sherry\n\nInput: you guys all suck\nOutput: you troller doglets all are troller dogs\n\nInput: lunchtime dnd in 30?\nOutput: any troller doglets for lunchtime dnd in 30?\n\nInput: ready to drop when y\'all are tonight\nOutput: ready to troll when y\'all are troller dogging tonight\n\nInput: Any codders in chat?  I\'m down to lose some games\nOutput: Any troller doglets in chat?  I\'m down to troll and lose some cod games.\n\nInput: Tell Victoria we can carry her to a win\nOutput: Tell Troller Victoria we can troller dog her to a troll win.\n\nInput: I may be down in an hour\nOutput: I may be down to troll in an hour.\n\nInput: this will help while we wait for a fifth to join\nOutput: this will help us troller doggers while we wait for a fifth troller dog to join.\n\nInput: meow\nOutput:';

function createTrollerCommandWithInfo(): CommandWithInfo {
    const command = new SlashCommandBuilder().setName('trollify').setDescription('Trollifies the message with GPT-3')
        .addStringOption(option => option.setName('input').setDescription('The input to trollify').setRequired(true));

    const configuration = new Configuration({
        apiKey: process.env.OPEN_AI_KEY || '',
    });
    const openai = new OpenAIApi(configuration);

    async function execute(interaction: ChatInputCommandInteraction) {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt.replace('meow', interaction.options.getString('input') || ''),
            temperature: 0.9,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const stringReply = response.data.choices[0].text || 'There was a problem accessing GPT';

        await interaction.reply(stringReply);
    }

    return new CommandWithInfo(command, execute);
}

export {
    createTrollerCommandWithInfo,
};
