import {Client} from "pioucord";
import {readFile, opendir, writeFile} from "node:fs/promises";
import {getToken} from "./util/functions.js";
import toml from "toml";

const config = toml.parse(await readFile("./config.toml", "utf-8"));

const {login, password} = config.account;

const tokensString = await readFile("./src/tokens", "utf-8"); // Lines of login=token
const tokens = Object.fromEntries(tokensString.split("\n").map(line => line.split("=")));

let token;
if (tokens[login]) {
    token = tokens[login];
} else {
    console.log("Token not found, requesting a new one...");
    const data = await getToken(login, password);
    token = data.token;
    await writeFile("./src/tokens", `${login}=${token}`, {flag: "a", encoding: "utf-8"});
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