const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flightrequest')
        .setDescription('Submit a flight approval request')
        .addStringOption(option => 
            option.setName('id').setDescription('The Flight ID (e.g., FL-102)').setRequired(true))
        .addStringOption(option => 
            option.setName('route').setDescription('Departure and Arrival (e.g., LAX-JFK)').setRequired(true))
        .addStringOption(option => 
            option.setName('time').setDescription('Scheduled Time (e.g., 14:00 EST)').setRequired(true)),
            
    async execute(interaction) {
        const allowedRoles = ['1506944158865166336', '1507599514721058876'];
        const hasPermission = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));
        
        if (!hasPermission) {
            return interaction.reply({ content: '🚫 You do not have the required roles to use this command.', ephemeral: true });
        }

        const flightId = interaction.options.getString('id');
        const route = interaction.options.getString('route');
        const time = interaction.options.getString('time');

        const pendingChannelId = '1516413978513899570';
        const logChannelId = '1509542966614818897';
        const pingRoleId = '1506944158865166336';

        const pendingChannel = interaction.client.channels.cache.get(pendingChannelId) || await interaction.client.channels.fetch(pendingChannelId).catch(() => null);
        const logChannel = interaction.client.channels.cache.get(logChannelId) || await interaction.client.channels.fetch(logChannelId).catch(() => null);

        if (!pendingChannel) {
            return interaction.reply({ content: '❌ Error: Could not find the pending flight channel.', ephemeral: true });
        }

        const flightAssetUrl = "https://cdn.discordapp.com/attachments/1507235764126093453/1510130338637025300/020560.KS_1.png";

        const pendingEmbeds = [
            {
                "color": 15158332,
                "image": { "url": "https://cdn.discordapp.com/attachments/1507235764126093453/1509055531799810109/1.png" }
            },
            {
                "title": "<:connectingflight:1507383457377026138> Flight to Approve (Staff Ping)",
                "description": `> **Host:** ${interaction.user}\n> **Flight ID:** \`${flightId}\`\n> **Route:** \`${route.toUpperCase()}\`\n> **Time:** \`${time}\`\n\n**Status:** ⏳ Pending Staff Review`,
                "color": 15158332,
                "image": { "url": "https://cdn.discordapp.com/attachments/1507235764126093453/1509055532286087220/2.png" },
                "thumbnail": { "url": flightAssetUrl },
                "footer": { "text": "Asiana Utilities - Created by Aether for Asiana.", "icon_url": interaction.client.user.displayAvatarURL() }
            }
        ];

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('flight_approve').setLabel('Approve').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('flight_deny').setLabel('Deny').setStyle(ButtonStyle.Danger)
        );

        await pendingChannel.send({ 
            content: `<@&${pingRoleId}> A new flight request requires review!`,
            embeds: pendingEmbeds, 
            components: [buttons]
        });

        if (logChannel) {
            const initialLog = [
                {
                    "title": "📋 Flight Log - Pending Review",
                    "description": `**Host:** ${interaction.user}\n**Flight ID:** \`${flightId}\`\n**Route:** \`${route.toUpperCase()}\`\n**Time:** \`${time}\`\n\n**Current Status:** 🟡 Pending Review`,
                    "color": 15158332,
                    "thumbnail": { "url": flightAssetUrl },
                    "timestamp": new Date().toISOString()
                }
            ];
            await logChannel.send({ embeds: initialLog });
        }

        await interaction.reply({ content: '✅ Your flight request has been successfully submitted for approval.', ephemeral: true });
    },
};