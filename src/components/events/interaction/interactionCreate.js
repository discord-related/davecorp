module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return;
            try {
                button.execute(interaction, client);
            } catch (error) {
                console.log(error);
            }
        } else if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                command.execute(interaction, client);
            } catch (error) {
                console.log(error);
            }
        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (!modal) return;
            try {
                modal.execute(interaction, client);
            } catch (error) {
                console.log(error);
            }
        } else if (interaction.isStringSelectMenu()) {
            const select = client.selectMenus.get(interaction.customId);
            if (!select) return;
            try {
                select.execute(interaction, client);
            } catch (error) {
                console.log(error);
            }
        }
    },
};