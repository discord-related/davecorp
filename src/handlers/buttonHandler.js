async function loadButtons(client) {
    const { buttons } = client;

    const { loadFiles } = require("../functions/fileLoader.js");

    const Files = await loadFiles("./src/components/buttons");

    Files.forEach((file) => {
        const button = require(file);
        if (!button.id) return;
        try {
            client.buttons.set(button.id, button);
        } catch (error) {
            console.log(error);
        }
    });

    if (buttons.size < 1) return;
    return console.log(`🟩 Successfully loaded ${buttons.size} button(s)!`);
}

module.exports = { loadButtons };