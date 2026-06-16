const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boardingmusic')
        .setDescription('Plays boarding music on a continuous loop.'),
    async execute(interaction) {
        const member = await interaction.guild.members.fetch(interaction.member.id);
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) return interaction.reply({ content: '❌ You must be in a voice channel.', flags: MessageFlags.Ephemeral });

        const audioPath = path.join(__dirname, '../../audio/boarding.mp3');
        if (!fs.existsSync(audioPath)) return interaction.reply({ content: '❌ `boarding.mp3` missing.', flags: MessageFlags.Ephemeral });

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const connection = joinVoiceChannel({ channelId: voiceChannel.id, guildId: interaction.guild.id, adapterCreator: interaction.guild.voiceAdapterCreator });
        const player = createAudioPlayer();
        player.play(createAudioResource(audioPath));
        connection.subscribe(player);

        await interaction.editReply({ content: '🔁 **Now Looping:** Boarding Music.' });

        player.on(AudioPlayerStatus.Idle, () => {
            try { player.play(createAudioResource(audioPath)); } 
            catch (e) { if (connection.state.status !== 'destroyed') connection.destroy(); }
        });
    },
};