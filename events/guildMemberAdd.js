const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member) {
        // --- 1. SET YOUR WELCOME CHANNEL ID ---
        // Replace this string with the ID of your actual welcome channel
        const welcomeChannelId = '1507003420534636606'; 

        const channel = member.guild.channels.cache.get(welcomeChannelId) 
            || await member.guild.channels.fetch(welcomeChannelId).catch(() => null);

        if (!channel) {
            console.error('[Welcomer] Could not find the welcome channel. Check the ID.');
            return;
        }

        // --- 2. BUILD THE WELCOME EMBED ---
        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`👋 Welcome to ${member.guild.name}!`)
            .setDescription(`Hello ${member}, we are thrilled to have you here. Please make sure to read the rules and enjoy your stay!`)
            .setColor('#2ecc71') // Green color
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: 'Member Count', value: `You are member #${member.guild.memberCount}`, inline: true },
                { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setImage('https://cdn.discordapp.com/attachments/1507235764126093453/1514456480382845050/Untitled_design_5.png?ex=6a320682&is=6a30b502&hm=d62284671c25eca0a0e8ba4dcef94be54a834366ea84cc2765a4a860b1a56908&') // Optional: Add a cool banner URL here
            .setFooter({ text: `User ID: ${member.id}` })
            .setTimestamp();

        // --- 3. SEND THE MESSAGE ---
        await channel.send({ content: `Welcome, ${member}!`, embeds: [welcomeEmbed] });
    },
};