require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const http = require('http');
const express = require('express'); // Added Express

const app = express();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();

// --- Command & Event Loaders (Keep your existing code here) ---
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
}

// --- Interaction Handler ---
client.on(Events.InteractionCreate, async interaction => {
    // (Keep your existing Interaction Handler logic)
    if (!interaction.isChatInputCommand() && !interaction.isButton() && !interaction.isModalSubmit()) return;
    
    // ... [Your existing logic for commands, buttons, and modals] ...
});

// --- Web Server & Uptime ---
// Serve the landing page from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
    console.log(`Landing page and Bot server running on port ${process.env.PORT || 3000}`);
});

client.login(process.env.DISCORD_TOKEN);