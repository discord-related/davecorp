const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unclaim")
        .setDescription("Unclaim the order.")
        .setDMPermission(false),
    async execute(interaction, client) {
        try {
            const { config } = client;
            const { channel, member } = interaction;
            const { orderSystem: { baseColor, errorColor, ordersCategory, staffRole } } = config;

            const embed = new EmbedBuilder();

            if (!member.roles.cache.has(staffRole))
                return interaction.reply({
                    embeds: [
                        embed
                            .setTitle("Dave Corp | Orders")
                            .setColor(errorColor)
                            .setDescription(`You must have <@&${staffRole}> to unclaim orders.`),
                    ],
                    ephemeral: true
                });
            else if (channel.parentId !== ordersCategory)
                return interaction.reply({
                    embeds: [
                        embed
                            .setTitle("Dave Corp | Orders")
                            .setColor(errorColor)
                            .setDescription("You can only unclaim orders in the Orders category."),
                    ],
                    ephemeral: true
                });

            interaction.reply({
                embeds: [
                    embed
                        .setTitle("Dave Corp | Orders")
                        .setColor(baseColor)
                        .setDescription("Your order has been unclaimed and is now available for another staff member to claim.")
                ]
            });

        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: "An error occurred, check the console for more information.",
                ephemeral: true
            });
        }
    }
};