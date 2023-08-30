# channelpointsdiscordbot
Discord bot allowing for channel points and predictions a la Twitch

## Setup
1. Install Node.  I recommend using [`nvm`](https://github.com/nvm-sh/nvm) but feel free to use any method you like.  I've built on v17+.
2. Git Clone this repo

## Building Instructions
1. `npm install`
2. In the root directory create a file called `.env` with the contents:
```
DISCORD_BOT_TOKEN=bot-token-here
OPEN_AI_KEY=open-ai-key-here
```
(you do not need the open ai key for local development unless you are explicitly experimenting with that functionality)
3. `npm run build`
Note: lint is enforced. To verify run `npm run lint`; to fix solveable errors run `npm run fix-lint`.

## Testing Database Locally
To test the database, make sure you have a mongoDB instance running locally at `localhost:27017` (this is the default if you just start running Mongo).

Additionally, make sure your Mongo instance has a DB named `discord` and a collection named `keyValuePairs`.

Once you have your above Mongo instance running locally, you can test out anything that uses the database.

## More Testing Instructions
Since the Bot is probably running at any given time on our production server, it may be easiest to use your own discord test bot (and supply it to the DISCORD_BOT_TOKEN) for easier testing without conflicts.  Make sure you run `npm run deploy-commands` as outlined below in `Adding Commands` for your test bot to get the commands here registered to it.

## Running instructions
1. `npm start`

## Adding Commands
1. Create a new file in `src/commands` that exports a function that returns a `CommandWithInfo`.  Follow the example of `troll.ts`, but you will need to specify a command builder that includes the name of the command, and an execution function.  You will then need to import that in `src/index.ts` and `src/commandDeployment.ts`.  (A future code-cleanliness optimization would be to consolidate these into classes with decorators so you don't need to manually update a list).
2. If you're creating a new command, you will need to build, then run `npm run deploy-commands`.
