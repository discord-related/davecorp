async function loadModals(client) {
    const { modals } = client;

    const { loadFiles } = require("../functions/fileLoader.js");

    const Files = await loadFiles("./src/components/modals");

    Files.forEach((file) => {
        const modal = require(file);
        if (!modal.id) return;
        try {
            client.modals.set(modal.id, modal);
        } catch (error) {
            console.log(error);
        }
    });

    if (modals.size < 1) return;
    return console.log(`📝 Successfully loaded ${modals.size} modal(s)!`);
}

module.exports = { loadModals };