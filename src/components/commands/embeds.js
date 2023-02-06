const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle: { Primary, Success },
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embeds")
        .setDescription("Sends an embed message")
        .addStringOption((options) =>
            options
                .setName("embed")
                .setDescription("The embed to send")
                .setChoices({
                    name: "Rules",
                    value: "rules"
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

            const embed = options.getString("embed");

            switch (embed) {
            case "rules": {
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

                interaction.reply({ content: "Sent the rules embed.", ephemeral: true });
            }
                break;

            case "orderMessage": {
                channel.send({ content: ["Hello there! This channel is for making large or complicated orders of stuff we may or may not have in stock!", "When you press the order button below you will be asked to complete a questionnaire about your order. Once that is complete, a channel will be opened for your order, and a DaveCorp™️ employee will try to respond to you quickly to discuss the price and any other questions you have.", "If you have questions about how this works, feel free to ask in #general! Thank you for your business!\n**DaveCorp™️**"].join("\n\n"), components: [
                    new ActionRowBuilder().setComponents(
                        new ButtonBuilder()
                            .setCustomId("orderButton")
                            .setLabel("Order")
                            .setStyle(Primary)
                    )
                ] });

                interaction.reply({ content: "Sent the order embed.", ephemeral: true });
            }
                break;
            }
        } catch (error) {
            interaction.reply("An error occured, check the console for more information.");
            console.log(error);
        }
    }
};