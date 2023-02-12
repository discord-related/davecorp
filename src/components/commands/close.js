const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle: { Link },
    EmbedBuilder,
    SlashCommandBuilder
} = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("close")
        .setDescription("Close the support ticket")
        .addStringOption((options) =>
            options
                .setName("reason")
                .setDescription("The reason for closing the support ticket")
        )
        .setDMPermission(false),
    async execute(interaction, client) {
        try {
            const { channels, config } = client;
            const { channel, createdAt, member, options, user } = interaction;
            const { orderSystem: { baseColor, errorColor, ordersArchives, ordersCategory, staffRole } } = config;

            const reason = options.getString("reason") || "No reason provided.";

            if (!member.roles.cache.has(staffRole))
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("DaveCorp | Orders")
                            .setColor(errorColor)
                            .setDescription(`You must have <@&${staffRole}> to claim support tickets.`),
                    ],
                    ephemeral: true,
                });
            else if (channel.parentId !== ordersCategory)
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("DaveCorp | Orders")
                            .setColor(errorColor)
                            .setDescription("You can only close support tickets in Orders category."),
                    ],
                    ephemeral: true,
                });

            channels.cache
                .get(ordersArchives)
                .send({
                    embeds: [new EmbedBuilder()
                        .setTitle("Ticket Closed")
                        .setColor(baseColor)
                        .setFields(
                            {
                                name: "Opened By",
                                value: `<@${channel.topic.split(" | ")[1]}>`,
                                inline: true,
                            },
                            {
                                name: "Closed By",
                                value: `${user}`,
                            },
                            {
                                name: "Reason",
                                value: `${reason}`,
                            },
                            {
                                name: "Close Time",
                                value: `<t:${Math.floor(createdAt / 1000)}:f>`,
                            }
                        )],
                    files: [await createTranscript(channel, {
                        limit: -1,
                        returnType: "attachment",
                        fileName: `${channel.name}.html`,
                        saveImages: true,
                        poweredBy: false
                    })
                    ],
                })
                .then(async (message) => {
                    message.edit({
                        components: [new ActionRowBuilder().setComponents(
                            new ButtonBuilder()
                                .setLabel("View Transcript")
                                .setStyle(Link)
                                .setURL(`${message.attachments.map((attachment) => attachment.url)}`)
                        )]
                    });
                });

            channel.delete(`Closed by ${user.tag}`);
        } catch (error) {
            console.log(error);
            interaction.reply({
                content: "An error occurred, check the console for more information",
                ephemeral: true
            });
        }
    },
};