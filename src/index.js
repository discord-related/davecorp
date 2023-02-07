const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"]
});

client.config = require("../config.json");
console.clear();

const { loadButtons } = require("./handlers/buttonHandler.js");
const { loadCommands } = require("./handlers/commandHandler.js");
const { loadEvents } = require("./handlers/eventHandler.js");
const { loadModals } = require("./handlers/modalHandler.js");

client.buttons = new Collection();
client.commands = new Collection();
client.events = new Collection();
client.modals = new Collection();

loadButtons(client);
loadEvents(client);
loadModals(client);

client.login(client.config.token).then(async () => 
    await loadCommands(client)
);