const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notam')
        .setDescription('Check current NOTAMs for an airport.')
        .addStringOption(option => option.setName('icao').setDescription('Airport ICAO code').setRequired(true)),

    async execute(interaction) {
        const icao = interaction.options.getString('icao').toUpperCase();
        await interaction.reply(`⚠️ **NOTAMs for ${icao}:** Directing you to the [Aviation Weather Center NOTAM Portal](https://aviationweather.gov/data/notam?ids=${icao})`);
    },
};