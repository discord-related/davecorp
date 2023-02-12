const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle: { Link },
    EmbedBuilder,
} = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");

module.exports = {
    id: "closeOrder",
    async execute(interaction, client) {
        try {
            const { channels, config } = client;
            const { channel, createdAt, guild, member, user } = interaction;
            const { orderSystem: { baseColor, errorColor, ordersArchives, staffRole } } = config;

            if (!member.roles.cache.has(staffRole))
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${guild.name} | Support System`)
                            .setColor(errorColor)
                            .setDescription(`You need to have <@&${staffRole}> to close this support ticket.`)
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
                    })],
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