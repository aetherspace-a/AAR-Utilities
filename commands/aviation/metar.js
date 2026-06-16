const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('metar')
        .setDescription('Fetch real-time METAR for an airport.')
        .addStringOption(option => option.setName('icao').setDescription('Airport ICAO code (e.g. RPLL)').setRequired(true)),

    async execute(interaction) {
        const icao = interaction.options.getString('icao').toUpperCase();
        await interaction.deferReply();

        try {
            const response = await fetch(`https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`);
            const data = await response.json();
            
            if (!data || data.length === 0) return interaction.editReply('❌ Airport not found or no report available.');

            const embed = new EmbedBuilder()
                .setTitle(`🌤️ METAR: ${icao}`)
                .setDescription(`\`${data[0].rawOb}\``)
                .setColor(0x3498db)
                .setTimestamp()
                .setFooter({ text: 'Asiana Aviation Utilities' });

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            await interaction.editReply('❌ Error fetching data from Aviation Weather Center.');
        }
    },
};