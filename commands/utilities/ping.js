const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks the bot latency.'),

    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setTitle('📡 System Latency')
            .setColor(0x5865F2) // Professional Blurple
            .addFields(
                { name: 'API Latency', value: `${interaction.client.ws.ping}ms`, inline: true },
                { name: 'Bot Latency', value: `${latency}ms`, inline: true }
            )
            .setFooter({ text: 'Asiana Utilities • Connection Stable' })
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
    },
};