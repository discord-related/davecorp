async function loadCommands(client) {
    const { commands } = client;

    const { loadFiles } = require("../functions/fileLoader.js");

    await commands.clear();

    let commandsArray = [];

    const Files = await loadFiles("./src/components/commands");

    Files.forEach((file) => {
        const command = require(file);
        commands.set(command.data.name, command);

        commandsArray.push(command.data.toJSON());
    });
    try {
        client.application.commands.set(commandsArray);
    } catch (error) {
        console.log(error);
    }

    if (commands.size < 1) return;
    return console.log(`🤖 Successfully loaded ${commands.size} command(s)!`);
}

module.exports = { loadCommands };