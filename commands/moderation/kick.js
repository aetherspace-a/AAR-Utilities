const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from the server.')
        // Require the user to have the "Kick Members" permission
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for kicking')
                .setRequired(false)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            return interaction.reply({ content: '❌ That user is no longer in the server.', ephemeral: true });
        }

        // Prevent staff from trying to kick someone with a higher role than them or the bot
        if (!targetMember.kickable) {
            return interaction.reply({ 
                content: '🚫 I cannot kick this user. They may have a higher role than me or you.', 
                ephemeral: true 
            });
        }

        // Attempt to DM the user before kicking them
        try {
            await targetUser.send(`You have been kicked from **${interaction.guild.name}**. Reason: ${reason}`);
        } catch (error) {
            console.log(`Could not send DM to ${targetUser.tag}.`);
        }

        // Execute the kick
        await targetMember.kick(reason);

        const embed = new EmbedBuilder()
            .setTitle('🔨 Member Kicked')
            .setColor('#e67e22') // Orange color
            .addFields(
                { name: 'User', value: `${targetUser.tag}`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                { name: 'Reason', value: reason, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};