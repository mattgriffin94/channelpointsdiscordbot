import dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits, IntentsBitField } from 'discord.js';

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;

// They really discourage using all intents, but I want to anyway
const allIntents = new IntentsBitField();
for (const intent in GatewayIntentBits) {
	allIntents.add(GatewayIntentBits[intent as keyof typeof GatewayIntentBits]);
}

// Initialize Client
const client = new Client({ intents: allIntents });
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.login(token);