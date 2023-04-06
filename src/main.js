import {Client} from "pioucord";
import {readFile, opendir, writeFile, copyFile} from "node:fs/promises";
import {existsSync} from "node:fs";
import {getToken, checkConfig} from "./util/functions.js";
import toml from "toml";

let config;
try {
    config = toml.parse(await readFile("./config.toml", "utf-8"));
} catch (e) {
    if (!existsSync("./config.toml")) {
        console.log("config.toml file not found, creating a new one...\nYou can now edit it and restart the bot.");
        await copyFile("./src/configDefault.toml", "./config.toml");
    } else {
        console.log("Error while reading config.toml, please check if it's valid.\nIf you don't know how to fix it, delete it and restart the bot.");
    }
    process.exit(1);
}
checkConfig(config);

const {login, password} = config.account;

const tokensString = await readFile("./src/tokens.txt", "utf-8").catch(() => null) ?? ''; // Lines of login=token
const tokens = Object.fromEntries(tokensString.split("\n").map(line => line.split("=")));

let token;
if (tokens[login]) {
    token = tokens[login];
} else {
    console.log("Token not found, requesting a new one...");
    const data = await getToken(login, password);
    token = data.token;
    if (existsSync("./src/tokens.txt")) await writeFile("./src/tokens.txt", `${login}=${token}\n`, {flag: "a", encoding: "utf-8"});
    else await writeFile("./src/tokens.txt", `${login}=${token}\n`, {encoding: "utf-8"});
}
const client = new Client({
    intents: 33280,
    userBot: true
});
client.config = config;

const dirE = await opendir("./src/events");
for await (const dirent of dirE) {
    const event = (await import(`./events/${dirent.name}`)).default;
    client.ws.on(dirent.name.slice(0, -3).toUpperCase(), (...args) => event(client, ...args));
}

client.commands = new Map();
const dirC = await opendir("./src/commands");
for await (const dirent of dirC) {
    const command = (await import(`./commands/${dirent.name}`)).default;
    client.commands.set(command.name, command);
}

await client.login(token).catch(() => console.log("Invalid login provided!"));