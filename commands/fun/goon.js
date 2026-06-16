const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goon')
        .setDescription('Goons around the server.'),
    async execute(interaction) {
        await interaction.reply('🦹 The goon is on the loose! Be careful!');
    },
};