const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('a')
        .setDescription('A.'),
    async execute(interaction) {
        await interaction.reply('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!');
    },
};