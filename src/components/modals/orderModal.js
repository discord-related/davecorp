const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle: { Danger },
    ChannelType: { GuildText },
    EmbedBuilder,
    MessageType: { ChannelPinnedMessage },
    PermissionFlagsBits: {
        AddReactions,
        AttachFiles,
        EmbedLinks,
        ReadMessageHistory,
        SendMessages,
        ViewChannel
    },
} = require("discord.js");

module.exports = {
    id: "orderModal",

    async execute(interaction, client) {
        try {
            const { fields, guild, member, user } = interaction;
            const { config: { orderSystem } } = client;
            const { baseColor, ordersCategory, staffRole } = orderSystem;

            const minecraftUsername = fields.getTextInputValue("minecraftUsername");
            const order = fields.getTextInputValue("order");
            const whenNeeded = fields.getTextInputValue("whenNeeded");
            const wantDelivered = fields.getTextInputValue("wantDelivered");
            const deliveryInstructions = fields.getTextInputValue("deliveryInstructions") || "No instructions provided.";

            const category = guild.channels.cache.get(ordersCategory);

            const channel = await category.children.create({
                name: "order-" + user.username,
                type: GuildText,
                topic: `${user.username}'s order | ${user.id}`,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [ViewChannel]
                    },
                    {
                        id: staffRole,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory, AddReactions, AttachFiles, EmbedLinks]
                    },
                    {
                        id: user.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory, AddReactions, AttachFiles, EmbedLinks]
                    }
                ]
            });

            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: "DaveCorp | Orders",
                            iconURL: guild.iconURL({
                                size: 512
                            }),
                        })
                        .setTitle(`${user.username}'s Order`)
                        .setColor(baseColor)
                        .setThumbnail(user.avatarURL({
                            size: 512,
                        }))
                        .setFields(
                            {
                                name: "What is your Minecraft username?",
                                value: minecraftUsername
                            },
                            {
                                name: "What is your order?",
                                value: order
                            },
                            {
                                name: "When do you need it by?",
                                value: whenNeeded
                            },
                            {
                                name: "Do you want it delivered?",
                                value: wantDelivered
                            },
                            {
                                name: "Delivery instructions",
                                value: deliveryInstructions
                            },
                            {
                                name: "Orderer Statistics",
                                value: [
                                    `> 🧑 **User**: ${user}`,
                                    `> 💳 **User ID**: \`${user.id}\``,
                                    `> 🤝 **Member Since**: <t:${parseInt(
                                        member.joinedTimestamp / 1000
                                    )}:R>`,
                                    `> 📅 **Account Created**: <t:${parseInt(
                                        user.createdTimestamp / 1000
                                    )}:R>`,
                                ].join("\n"),
                            })
                        .setFooter({
                            text: "DaveCorp | Orders",
                            iconURL: guild.iconURL({
                                size: 512,
                            }),
                        })
                        .setTimestamp(),
                ], components: [
                    new ActionRowBuilder()
                        .setComponents(
                            new ButtonBuilder()
                                .setCustomId("closeOrder")
                                .setLabel("Close")
                                .setEmoji("🔒")
                                .setStyle(Danger)
                                .setDisabled(false)
                        ),
                ]
            }).then(async (message) => message.pin(`${user.username}'s order message.`));

            const collector = channel.createMessageCollector({
                filter: message => message.type === ChannelPinnedMessage,
                time: 5000,
            });

            collector.on("collect", async (message) => {
                setTimeout(() => message.delete(), 5000);
            });

            interaction.reply({
                content: `Thank you for making an order, check the <#${channel.id}> for more information.`,
                ephemeral: true
            });

        } catch (error) {
            console.log(error);
            await interaction.reply({ content: "An error occurred, please try again later.", ephemeral: true });
        }
    }
};