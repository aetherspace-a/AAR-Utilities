const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Instantly stops the cabin audio and disconnects the bot.'),

    async execute(interaction) {
        // 1. Get the bot's active connection in this specific server
        const connection = getVoiceConnection(interaction.guild.id);

        // 2. If the bot isn't in a voice channel, let the user know
        if (!connection) {
            return interaction.reply({ 
                content: '❌ The bot is not currently playing any audio or connected to a voice channel.', 
                flags: MessageFlags.Ephemeral 
            });
        }

        // 3. Optional: Ensure the person running the command is in the same channel as the bot
        const memberVoiceChannel = interaction.member.voice.channel;
        if (!memberVoiceChannel) {
            return interaction.reply({ 
                content: '❌ You must be in a voice channel to stop the cabin music.', 
                flags: MessageFlags.Ephemeral 
            });
        }

        try {
            // 4. Safely terminate the audio stream and leave the channel
            connection.destroy();

            // 5. Send a clean confirmation message
            await interaction.reply({ 
                content: '🛑 **Audio Operations Halted:** The cabin audio has been stopped and the system disconnected.' 
            });
            
        } catch (error) {
            console.error('[Stop Command Error]', error);
            await interaction.reply({ 
                content: '❌ An error occurred while trying to shut down the audio connection.', 
                flags: MessageFlags.Ephemeral 
            });
        }
    },
};