# channelpointsdiscordbot

Discord bot allowing for channel points and predictions a la Twitch

## Setup

1. Install Node. I recommend using [`nvm`](https://github.com/nvm-sh/nvm) but feel free to use any method you like. I've built on v17+.
2. Git Clone this repo

## Building Instructions

1. `npm install`
2. In the root directory create a file called `.env` with the contents:

```
DISCORD_BOT_TOKEN=bot-token-here
OPEN_AI_KEY=open-ai-key-here
```

(you do not need the open ai key for local development unless you are explicitly experimenting with that functionality) 3. `npm run build`
Note: lint is enforced. To verify run `npm run lint`; to fix solveable errors run `npm run fix-lint`.

## Running instructions

1. `npm start`

## Adding Commands

1. Create a new file in `src/commands` that exports a function that returns a `CommandWithInfo`. Follow the example of `troll.ts`, but you will need to specify a command builder that includes the name of the command, and an execution function. You will then need to import that in `src/index.ts` and `src/commandDeployment.ts`. (A future code-cleanliness optimization would be to consolidate these into classes with decorators so you don't need to manually update a list).
2. If you're creating a new command, you will need to build, then run `npm run deploy-commands`.

## Testing

1. Add tests to `src/tests`. Tests are run using `jest`. See the [jest docs](https://jestjs.io/docs/getting-started) for more information.
2. Run `npm run test`

## Firebase Database Setup

To use the Firebase database with this project, you will need to create a Firebase project and download the service account key.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Go to the [Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk) page in the Firebase Console.
3. Click the "Generate new private key" button to download the service account key.
4. Place the service account key in the `src/config` folder of this project.

Make sure to update the `dbInit.ts` file with your Firebase project's ID. This involves copying the reference URL in the Realtime Database of your project and pasting it in the `databaseURL` field.

Once you have set up your Firebase project and placed the service account key in the `src/config` folder, you can use the `User`, `Bet`, and `Log` models in your code to create, read, update, and delete records in the database.
