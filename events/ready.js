const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Ready! Logged in as ${client.user.tag}`);
        
        // Set a custom status for your bot
        client.user.setPresence({
            activities: [{ name: '/ping • AsianaUtils', type: ActivityType.Watching }],
            status: 'online',
        });
    },
};