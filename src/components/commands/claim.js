const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("claim")
        .setDescription("Claim the order.")
        .setDMPermission(false),
    async execute(interaction, client) {
        try {
            const { config } = client;
            const { channel, member, user } = interaction;
            const { orderSystem: { baseColor, errorColor, ordersCategory, staffRole } } = config;

            const embed = new EmbedBuilder();

            if (!member.roles.cache.has(staffRole))
                return interaction.reply({
                    embeds: [
                        embed
                            .setTitle("Dave Corp | Orders")
                            .setColor(errorColor)
                            .setDescription(`You must have <@&${staffRole}> to claim orders.`),
                    ],
                    ephemeral: true
                });
            else if (channel.parentId !== ordersCategory)
                return interaction.reply({
                    embeds: [
                        embed
                            .setTitle("Dave Corp | Orders")
                            .setColor(errorColor)
                            .setDescription("You can only claim orders in the Orders category."),
                    ],
                    ephemeral: true
                });

            interaction.reply({
                embeds: [
                    embed
                        .setTitle("Dave Corp | Orders")
                        .setColor(baseColor)
                        .setDescription(`Your order has been claimed by ${user}!`)
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