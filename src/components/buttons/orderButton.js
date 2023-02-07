const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle: { Paragraph, Short }
} = require("discord.js");

module.exports = {
    id: "orderButton",
    async execute(interaction, client) {
        try {
            const { config: { orderSystem: { blacklist } } } = client;
            const { member: { roles } } = interaction;

            if (roles.cache.has(blacklist.role))
                return interaction.reply({ content: blacklist.message, ephemeral: true });

            interaction.showModal(
                new ModalBuilder()
                    .setTitle("DaveCorp | Order")
                    .setCustomId("orderModal")
                    .setComponents(
                        new ActionRowBuilder().setComponents(
                            new TextInputBuilder()
                                .setCustomId("minecraftUsername")
                                .setLabel("What is your Minecraft username?")
                                .setMinLength(1)
                                .setMaxLength(16)
                                .setStyle(Short)
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().setComponents(
                            new TextInputBuilder()
                                .setCustomId("order")
                                .setLabel("What is your order?")
                                .setMinLength(1)
                                .setMaxLength(128)
                                .setStyle(Short)
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().setComponents(
                            new TextInputBuilder()
                                .setCustomId("whenNeeded")
                                .setLabel("When do you need it by?")
                                .setMinLength(1)
                                .setMaxLength(128)
                                .setStyle(Short)
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().setComponents(
                            new TextInputBuilder()
                                .setCustomId("wantDelivered")
                                .setLabel("Do you want it delivered?")
                                .setMinLength(1)
                                .setMaxLength(128)
                                .setStyle(Short)
                                .setRequired(true)),
                        new ActionRowBuilder().setComponents(
                            new TextInputBuilder()
                                .setCustomId("deliveryInstructions")
                                .setLabel("Delivery instructions")
                                .setMinLength(1)
                                .setMaxLength(256)
                                .setStyle(Paragraph)
                                .setRequired(false)
                        )
                    ));

        } catch (error) {
            console.log(error);
            await interaction.reply({ content: "An error occurred, please try again later.", ephemeral: true });
        }
    }
};