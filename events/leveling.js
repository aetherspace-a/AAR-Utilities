const fs = require('node:fs');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        const dataPath = './database.json';
        let db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        if (!db[message.author.id]) db[message.author.id] = { xp: 0, level: 1 };
        
        // XP calculation
        db[message.author.id].xp += Math.floor(Math.random() * 5) + 1;
        const curXp = db[message.author.id].xp;
        const curLvl = db[message.author.id].level;
        const nextLvlXp = curLvl * 100;

        if (curXp >= nextLvlXp) {
            db[message.author.id].level += 1;
            db[message.author.id].xp = 0;
            const newLevel = db[message.author.id].level;
            
            // Assign Roles
            const roles = { 10: '1507304664016748615', 20: '1507304633259921408', 30: '1507304599587917856', 40: '1507304525751521400', 50: '1507304504465428635' };
            if (roles[newLevel] || newLevel >= 50) {
                const roleId = roles[newLevel] || roles[50];
                const role = message.guild.roles.cache.get(roleId);
                if (role) await message.member.roles.add(role);
            }

            // Beautiful Level Up Embed
            const embed = new EmbedBuilder()
                .setTitle('⬆️ Level Up!')
                .setDescription(`Congratulations <@${message.author.id}>! You reached level **${newLevel}**!`)
                .setColor(0xF1C40F)
                .setThumbnail(message.author.displayAvatarURL());
            message.channel.send({ embeds: [embed] });
        }
        fs.writeFileSync(dataPath, JSON.stringify(db, null, 4));
    },
};