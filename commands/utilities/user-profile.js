const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-profile')
        .setDescription('View your member profile.')
        .addUserOption(option => option.setName('target').setDescription('The user to view')),

    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setTitle(`👤 ${user.username}'s Profile`)
            .setThumbnail(user.displayAvatarURL())
            .setColor(0x9B59B6)
            .addFields(
                { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
                { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true },
                { name: 'Roles', value: member.roles.cache.map(r => r).join(', ').slice(0, 1024), inline: false }
            )
            .setFooter({ text: 'Asiana Utilities • Member Details' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};