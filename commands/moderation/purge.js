const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a specified number of messages from the channel.')
        // Require the user to have the "Manage Messages" permission
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        // Fetch and delete the messages
        // bulkDelete(amount, true) ensures it ignores messages older than 14 days (Discord API limit)
        const deletedMessages = await interaction.channel.bulkDelete(amount, true);

        const embed = new EmbedBuilder()
            .setColor('#e74c3c') // Red color
            .setDescription(`🗑️ Successfully deleted **${deletedMessages.size}** messages.`);

        // Reply ephemerally so the bot's confirmation message doesn't clutter the freshly cleaned chat
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};