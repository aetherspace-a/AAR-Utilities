const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const welcomeChannel = member.guild.channels.cache.get('1507309046158458971'); // Welcome/Chat Channel
        if (!welcomeChannel) return;

        const embed = new EmbedBuilder()
            .setColor(0xE6A03C) // 15158332 converted to hex
            .setTitle("<:partner:1507382858690330754>┃Welcome to Asiana Airlines PTFS")
            .setDescription(`<:dot:1507384373039595680> Hello, ${member.user.toString()}, To ensure a smooth takeoff, please head over to ⁠verification to <#1507309502372778054> your boarding pass and gain access to the terminal. After that, we ask that you read through our <#1507243351571955842> over at ⁠regulations. Once you are settled in and ready to travel, you can check the departure board in <#1507312279736029264> to attend a flight.\n\nThank you for choosing to fly with us. We hope you enjoy your journey as our ${member.guild.memberCount}th passenger!\n아시아나항공을 선택해 주셔서 감사합니다. ${member.guild.memberCount}번째 승객으로서 즐거운 여행이 되시길 바랍니다!`)
            .setImage("https://cdn.discordapp.com/attachments/1507235764126093453/1507236874576465940/Fly_Asiana_Fly_Smart..png")
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: "Asiana Airlines PTFS - Created by Aether, for Asiana.", iconURL: "https://cdn.discordapp.com/attachments/1507235764126093453/1510130338637025300/020560.KS_1.png" });

        // Add the Welcome Button
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`welcome_btn_${member.id}`)
                    .setLabel('Welcome the Passenger!')
                    .setStyle(ButtonStyle.Primary)
            );

        await welcomeChannel.send({ embeds: [embed], components: [row] });
    },
};