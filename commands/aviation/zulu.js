const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('zulu')
        .setDescription('Get the current Zulu (UTC) time.'),

    async execute(interaction) {
        const now = new Date();
        const zuluTime = now.toUTCString();

        const embed = new EmbedBuilder()
            .setTitle('🌐 Zulu Time (UTC)')
            .setDescription(`**Current Time:** \`${zuluTime}\``)
            .setColor(0xf1c40f)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};