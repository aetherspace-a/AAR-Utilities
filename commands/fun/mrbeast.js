const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mrbeast')
        .setDescription('Wanna be in a video?'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('💰 MRBEAST HERE!')
            .setDescription('I AM GIVING AWAY 10,000$ TO THE NEXT PERSON TO TYPE THE MOST SUBSCRIPTIONS!')
            .setColor('#ff0000')
            .setImage('https://cdn.discordapp.com/attachments/1507309046158458971/1516387634958696458/image.png?ex=6a327589&is=6a312409&hm=d3a2ef807ce04acd743f83f5f0de25308635f876ee7dbf0afb083a3a9d8bbeb6&'); // You can add a URL here
        
        await interaction.reply({ embeds: [embed] });
    },
};