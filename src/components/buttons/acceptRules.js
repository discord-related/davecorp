module.exports = {
    id: "acceptRules",
    async execute(interaction, client) {
        try {
            const { config: { customerRole } } = client;
            const { member } = interaction;

            const hasRole = member.roles.cache.has(customerRole);

            if (hasRole) {
                member.roles.remove(customerRole);
                interaction.reply({
                    content: "You already had the customer role, so I removed it.",
                    ephemeral: true
                });
            } else {
                member.roles.add(customerRole);
                interaction.reply({
                    content: "Thank you for reading the rules, you now have access to rest of the server.",
                    ephemeral: true
                });
            }
        } catch (error) {
            interaction.reply("An error occured, please try again later.");
            console.log(error);
        }
    }
};