const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lofi')
        .setDescription('Plays 24/7 lofi in your channel or stage.'),
    async execute(interaction) {
        const member = await interaction.guild.members.fetch(interaction.member.id);
        const channel = member.voice.channel;

        if (!channel) return interaction.reply({ content: '❌ Join a channel first!', flags: MessageFlags.Ephemeral });

        const audioPath = path.join(__dirname, '../../audio/lofi.mp3'); // Ensure this file exists!
        if (!fs.existsSync(audioPath)) return interaction.reply({ content: '❌ `lofi.mp3` not found in audio folder.', flags: MessageFlags.Ephemeral });

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const conn = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        // STAGE CHANNEL FIX: If the channel is a stage, we must request to speak
        if (channel.type === 13) { // 13 is the internal ID for Stage Channels
            try {
                await interaction.guild.members.me.voice.setSuppressed(false);
            } catch (e) {
                return interaction.editReply('❌ I don\'t have permission to speak on this Stage.');
            }
        }

        const player = createAudioPlayer();
        player.play(createAudioResource(audioPath));
        conn.subscribe(player);

        await interaction.editReply({ content: '🎧 **Now streaming 24/7 Lofi...**' });

        player.on(AudioPlayerStatus.Idle, () => {
            try { player.play(createAudioResource(audioPath)); } 
            catch (e) { conn.destroy(); }
        });
    }
};