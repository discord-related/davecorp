const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Transfer the order to another staff member.")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("The user to transfer the order to.")
                .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction, client) {
        try {
            const { config } = client;
            const { channel, member, options } = interaction;
            const { orderSystem: { baseColor, errorColor, ordersCategory, staffRole } } = config;

            const user = options.getUser("user");

            const embed = new EmbedBuilder();

            if (!member.roles.cache.has(staffRole))
                return interaction.reply({
                    embeds: [
                        embed
                            .setTitle("Dave Corp | Orders")
                            .setColor(errorColor)
                            .setDescription(`You must have <@&${staffRole}> to transfer orders.`),
                    ],
                    ephemeral: true
                });
            else if (channel.parentId !== ordersCategory)
                return interaction.reply({
                    embeds: [
                        embed
                            .setTitle("Dave Corp | Orders")
                            .setColor(errorColor)
                            .setDescription("You can only transfer orders in the Orders category."),
                    ],
                    ephemeral: true
                });

            interaction.reply({
                embeds: [
                    embed
                        .setTitle("Dave Corp | Orders")
                        .setColor(baseColor)
                        .setDescription(`Your order has been transferred to ${user}!`)
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