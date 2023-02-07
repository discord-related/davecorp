const {
    EmbedBuilder,
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setavatar")
        .setDescription("Set the bot's avatar to the guild's icon.")
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    async execute(interaction, client) {
        try {
            const { config, user } = client;
            const { guild } = interaction;
            const { orderSystem: { baseColor } } = config;

            await user.setAvatar(guild.iconURL({ size: 1024 }));
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${guild.name} | Avatar`)
                        .setColor(baseColor)
                        .setDescription("The bot's avatar has been set to the guild icon.")
                        .setImage(guild.iconURL({ size: 1024 }))
                        .setFooter({
                            text: `${guild.name} | Avatar`,
                            iconURL: guild.iconURL({ size: 1024 }),
                        })
                        .setTimestamp(),
                ],
            });
        } catch (error) {
            console.log(error);
            interaction.reply({
                content: "An error occurred, check the console for more information.",
                ephemeral: true,
            });
        }
    },
};