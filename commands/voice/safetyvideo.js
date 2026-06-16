const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('safetyvideo')
        .setDescription('Plays safety audio and posts the video link.'),
    async execute(interaction) {
        const member = await interaction.guild.members.fetch(interaction.member.id);
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) return interaction.reply({ content: '❌ You must be in a voice channel.', ephemeral: true });

        const audioPath = path.join(__dirname, '../../audio/safety.mp3');
        if (!fs.existsSync(audioPath)) return interaction.reply({ content: '❌ `safety.mp3` missing.', ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('📺 Asiana Safety Briefing')
            .setColor(3066993)
            .setDescription(`[Click here to watch the Safety Video](https://youtube.com/your-video-link-here)`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        const connection = joinVoiceChannel({ channelId: voiceChannel.id, guildId: interaction.guild.id, adapterCreator: interaction.guild.voiceAdapterCreator });
        const player = createAudioPlayer();
        player.play(createAudioResource(audioPath));
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            setTimeout(() => { if (connection.state.status !== 'destroyed') connection.destroy(); }, 2000);
        });
    },
};