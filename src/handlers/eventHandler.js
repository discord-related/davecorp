async function loadEvents(client) {
    const { events } = client;

    const { loadFiles } = require("../functions/fileLoader.js");

    await events.clear();

    const Files = await loadFiles("./src/components/events");

    Files.forEach((file) => {
        const event = require(file);

        const execute = (...args) => event.execute(...args, client);
        try {
            events.set(event.name, execute);
        } catch (error) {
            console.log(error);
        }
        if (event.rest) {
            if (event.once) client.rest.once(event.name, execute);
            else client.rest.on(event.name, execute);
        } else {
            if (event.once) client.once(event.name, execute);
            else client.on(event.name, execute);
        }
    });

    if (events.size < 1) return;
    return console.log(`🎉 Successfully loaded ${events.size} event(s)!`);
}

module.exports = { loadEvents };