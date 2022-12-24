import dotenv from 'dotenv';
import { Events, GatewayIntentBits, IntentsBitField } from 'discord.js';
import { CommandClient } from './classes/CommandClient';
import { createTrollerCommandWithInfo } from './commands/troll';

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;

// They really discourage using all intents, but I want to anyway
const allIntents = new IntentsBitField();
for (const intent in GatewayIntentBits) {
    allIntents.add(GatewayIntentBits[intent as keyof typeof GatewayIntentBits]);
}

// Initialize Client
const client = new CommandClient({ intents: allIntents });
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.login(token);


// Register commands
const commandsWithInfo = [
    createTrollerCommandWithInfo(),
];
for (const command of commandsWithInfo) {
    client.commands.set(command.info.name, command);
}

// Handle Commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const commandClient = interaction.client as CommandClient;
    const command = commandClient.commands.get(interaction.commandName);
    try {
        await command?.execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});