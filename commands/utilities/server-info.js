const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Displays server information.'),

    async execute(interaction) {
        const { guild } = interaction;
        const embed = new EmbedBuilder()
            .setTitle(`🏢 ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .setColor(0x3498DB)
            .addFields(
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: false }
            )
            .setFooter({ text: 'Asiana Utilities • Server Stats' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};