const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('force-qotd')
        .setDescription('Manually trigger the QOTD embed.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Only staff with this perm can use it

    async execute(interaction) {
        const channel = interaction.guild.channels.cache.get('1507766708159516682');
        if (!channel) return interaction.reply({ content: '❌ QOTD channel not found.', ephemeral: true });

        // Load your questions
        const questionsPath = path.join(__dirname, '../../questions.json');
        const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
        
        // Pick a random question for the force command
        const question = questions[Math.floor(Math.random() * questions.length)];

        const embed1 = { color: 15158332, image: { url: "https://cdn.discordapp.com/attachments/1507235764126093453/1514456480382845050/Untitled_design_5.png" } };
        const embed2 = {
            title: "<:connectingflight:1507383457377026138> Question of the Day! - Asiana Airlines PTFS",
            description: `> **Question:** ${question}`,
            color: 15158332,
            image: { url: "https://cdn.discordapp.com/attachments/1507235764126093453/1509055532286087220/2.png" },
            thumbnail: { url: "https://cdn.discordapp.com/attachments/1507235764126093453/1510130338637025300/020560.KS_1.png" },
            footer: { text: "Asiana Utilities - Created by Aether for Asiana." }
        };

        await channel.send({ content: '@here', embeds: [embed1, embed2] });
        await interaction.reply({ content: '✅ QOTD has been forcefully posted.', ephemeral: true });
    },
};