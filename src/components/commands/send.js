const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle: { Primary, Success },
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("Sends the selected message from the provided options")
        .addStringOption((options) =>
            options
                .setName("message")
                .setDescription("The message to send")
                .setChoices({
                    name: "Rules Message",
                    value: "rulesMessage"
                }, {
                    name: "Order Message",
                    value: "orderMessage"
                })
                .setRequired(true))
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        try {
            const { channel, options } = interaction;

            const embed = options.getString("message");

            switch (embed) {
            case "rulesMessage": {
                channel.send({
                    content: ["Welcome to DaveCorp™️ official business server. Please read the following rules, and click the button below to accept the terms, and unlock the rest of the server.", "Same rules here as for the SurvivalMC server. Keep it nice, don't be mean/rude, and overall don't try to waste people's time."].join("\n\n"), components: [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder()
                                .setCustomId("acceptRules")
                                .setEmoji("✅")
                                .setLabel("Accept")
                                .setStyle(Success)
                        )
                    ]
                });

                interaction.reply({ content: "Sent the rules message.", ephemeral: true });
            }
                break;

            case "orderMessage": {
                channel.send({ content: ["Hello there! This channel is for making large or complicated orders of stuff we may or may not have in stock!", "When you press the order button below you will be asked to complete a questionnaire about your order. Once that is complete, a channel will be opened for your order, and a DaveCorp™️ employee will try to respond to you quickly to discuss the price and any other questions you have.", "If you have questions about how this works, feel free to ask in <#1071264537979912294>! Thank you for your business!\n**DaveCorp™️**"].join("\n\n"), components: [
                    new ActionRowBuilder().setComponents(
                        new ButtonBuilder()
                            .setCustomId("orderButton")
                            .setLabel("Make an order")
                            .setStyle(Primary)
                    )
                ] });

                interaction.reply({ content: "Sent the order message.", ephemeral: true });
            }
                break;
            }
        } catch (error) {
            interaction.reply("An error occured, check the console for more information.");
            console.log(error);
        }
    }
};