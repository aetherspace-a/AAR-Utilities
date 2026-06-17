const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('openserver')
        .setDescription('Sends the Server Opened announcement to the designated channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const targetChannelId = '1507312279736029264';
        const roleToMention = '1507385048779984906';
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return interaction.reply({ content: '❌ Could not find the announcement channel.', ephemeral: true });
        }

        const embedData = {
            embeds: [
                {
                    "color": 15158332,
                    "image": {
                        "url": "https://cdn.discordapp.com/attachments/1507766955250155561/1514603195995783218/Untitled_design_2.png?ex=6a2bf7a5&is=6a2aa625&hm=7fafd9d9484c3f7826742c48eff7614c95e2979c0f63de33759ac95c2b9bc29c&"
                    }
                },
                {
                    "description": "## <:warning:1507383544723275846>  Server Opened\n\n> Please proceed to the gate assigned by the VAMS System. If you booked through our website, you may also check in using /checkin [booking_ref], replacing [booking_ref] with the booking reference found on your ticket.\n> \n> If you did not book through the website, please proceed to the check-in counters at your departure airport.\n> \n> Thank you for choosing Asiana Airlines PTFS. We wish you a pleasant flight.",
                    "color": 15158332
                }
            ],
            "components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "style": 5,
                            "label": "Join Server by pressing this link.",
                            "emoji": {
                                "id": "1507382269256401006",
                                "name": "transexitsign",
                                "animated": false
                            },
                            "url": "https://roblox.com/discover#/rg-join/20321167/b99790d0-c722-473d-ab24-80b5032d517d"
                        }
                    ]
                }
            ]
        };

        try {
            await targetChannel.send({
                content: `<@&${roleToMention}>`,
                embeds: embedData.embeds,
                components: embedData.components
            });
            await interaction.reply({ content: `✅ Announcement sent to <#${targetChannelId}>!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Failed to send the announcement. Please check bot permissions.', ephemeral: true });
        }
    },
};