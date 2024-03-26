# Ethers-Watcher-POC

A sample project to demonstrate how to use ethers.js to watch for transfer events on the Ethereum blockchain.

## Build

```sh
npm ci
npm run build
```

Then you can copy `dist/` to whatever server you want to deploy to and use `node index.js` to run.

## Configuration

Create a `.env` file and put `INFURA_PROJECT_ID=<YOUR_INFURA_PROJECT_ID>`.

[dotenv](https://www.npmjs.com/package/dotenv) will load this file under working directory.

Or just set the environment variables directly.

## Develop

You can use:

```sh
npm start
```

to run in dev mode.
