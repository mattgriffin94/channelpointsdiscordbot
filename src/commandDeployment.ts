import { REST, Routes } from 'discord.js';
import { createTrollerCommandWithInfo } from './commands/troll';
import { addPoints } from './commands/addPoints';
import { clientId } from './config.json';
import dotenv from 'dotenv';

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN || '';

const commandJSONs = [
    createTrollerCommandWithInfo().info.toJSON(),
    addPoints().info.toJSON(),
];

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(
            `Started refreshing ${commandJSONs.length} application (/) commands.`,
        );

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(Routes.applicationCommands(clientId), {
            body: commandJSONs,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.log(
            `Successfully reloaded ${(data as any).length} application (/) commands.`,
        );
    }
    catch (error) {
        console.error(error);
    }
})();
