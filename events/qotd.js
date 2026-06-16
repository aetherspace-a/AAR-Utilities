const cron = require('node-cron');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        // Runs at 09:00 AM daily
        cron.schedule('0 9 * * *', async () => {
            const channel = await client.channels.fetch('1507766708159516682');
            if (!channel) return;

            const questionsPath = path.join(__dirname, '../questions.json');
            const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

            // Get day of the year (0-364)
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 0);
            const diff = now - start;
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);

            const question = questions[dayOfYear % questions.length];

            const embed1 = { 
                color: 15158332, 
                image: { url: "https://cdn.discordapp.com/attachments/1507235764126093453/1514456480382845050/Untitled_design_5.png" } 
            };
            const embed2 = {
                title: "<:connectingflight:1507383457377026138> Question of the Day! - Asiana Airlines PTFS",
                description: `> **Question:** ${question}`,
                color: 15158332,
                image: { url: "https://cdn.discordapp.com/attachments/1507235764126093453/1509055532286087220/2.png" },
                thumbnail: { url: "https://cdn.discordapp.com/attachments/1507235764126093453/1510130338637025300/020560.KS_1.png" },
                footer: { text: "Asiana Utilities - Created by Aether for Asiana." }
            };

            await channel.send({ content: '@here', embeds: [embed1, embed2] });
        });
    },
};