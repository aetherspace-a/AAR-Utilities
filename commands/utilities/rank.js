const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder().setName('rank').setDescription('Check your current level.'),
    async execute(interaction) {
        const db = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
        const user = db[interaction.user.id] || { xp: 0, level: 1 };

        const embed = new EmbedBuilder()
            .setTitle(`🎖️ ${interaction.user.username}'s Rank`)
            .addFields(
                { name: 'Level', value: `${user.level}`, inline: true },
                { name: 'XP', value: `${user.xp} / ${user.level * 100}`, inline: true }
            )
            .setColor(0x5865F2);
        await interaction.reply({ embeds: [embed] });
    },
};