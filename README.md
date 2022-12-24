# channelpointsdiscordbot
Discord bot allowing for channel points and predictions a la Twitch

## Building Instructions
1. `npm install`
2. In the root directory create a file called `.env` with the contents:
```
DISCORD_BOT_TOKEN=bot-token-here
```
3. `npm run build`
Note: lint is enforced. To verify run `npm run lint`; to fix solveable errors run `npm run fix-lint`.

## Running instructions
1. `npm start`

## Adding Commands
1. Create a new file in `src/commands` that exports a function that returns a `CommandWithInfo`.  Follow the example of `troll.ts`, but you will need to specify a command builder that includes the name of the command, and an execution function.  You will then need to import that in `src/index.ts` and `src/commandDeployment.ts`.  (A future code-cleanliness optimization would be to consolidate these into classes with decorators so you don't need to manually update a list).
2. If you're creating a new command, you will need to build, then run `npm run deploy-commands`.
