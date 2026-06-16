const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        try {
            // --- 1. SLASH COMMAND ROUTER ---
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction);
            } 

            // --- 2. BUTTON INTERACTION -> OPENS CONFIRMATION FORM ---
            else if (interaction.isButton()) {
                if (interaction.customId === 'flight_approve' || interaction.customId === 'flight_deny') {
                    
                    // Safety check: Make sure interaction.member exists
                    if (!interaction.member) {
                        return interaction.reply({ content: '❌ Error: Cannot verify your roles. Please try again.', ephemeral: true });
                    }

                    const allowedRoles = ['1506944158865166336', '1507599514721058876'];
                    const hasPermission = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));
                    
                    if (!hasPermission) {
                        return interaction.reply({ content: '🚫 You do not have permission to review flight requests.', ephemeral: true });
                    }

                    const action = interaction.customId === 'flight_approve' ? 'approve' : 'deny';

                    // Create the modal popup
                    const modal = new ModalBuilder()
                        .setCustomId(`modal_flight_${action}`)
                        .setTitle(action === 'approve' ? 'Confirm Flight Approval' : 'Confirm Flight Denial');

                    const textInput = new TextInputBuilder()
                        .setCustomId('flight_reason')
                        .setLabel(action === 'approve' ? 'Optional Notes (Leave blank if none)' : 'Reason for Denial')
                        .setPlaceholder('Type your comments here...')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(action === 'deny'); // Required only if denying

                    const row = new ActionRowBuilder().addComponents(textInput);
                    modal.addComponents(row);

                    // Show the modal block to the administrator instantly
                    await interaction.showModal(modal);
                }
            }

            // --- 3. MODAL SUBMISSION -> EXECUTES FINAL UPDATES ---
            else if (interaction.isModalSubmit()) {
                if (interaction.customId.startsWith('modal_flight_')) {
                    // Instantly defer to give us time to process everything without timing out
                    await interaction.deferUpdate();

                    const isApproved = interaction.customId === 'modal_flight_approve';
                    const rawReason = interaction.fields.getTextInputValue('flight_reason');
                    const staffNotes = rawReason ? rawReason : 'No additional notes provided.';
                    
                    // Fetch the original embed card data safely
                    const originalEmbeds = interaction.message.embeds;
                    if (!originalEmbeds || originalEmbeds.length === 0) {
                        console.error('[Flight Modal] Could not find original embeds to edit.');
                        return;
                    }

                    // The main text is in the second embed (index 1) based on your layout
                    const targetEmbed = originalEmbeds.length > 1 ? originalEmbeds[1] : originalEmbeds[0];
                    const desc = targetEmbed.description || "";

                    // Deconstruct values safely using regex
                    const flightIdMatch = desc.match(/\*\*Flight ID:\*\* `([^`]+)`/);
                    const routeMatch = desc.match(/\*\*Route:\*\* `([^`]+)`/);
                    const hostMatch = desc.match(/\*\*Host:\*\* (<@!?\d+>)/);
                    const timeMatch = desc.match(/\*\*Time:\*\* `([^`]+)`/);

                    const flightId = flightIdMatch ? flightIdMatch[1] : "Unknown";
                    const route = routeMatch ? routeMatch[1] : "Unknown";
                    const host = hostMatch ? hostMatch[1] : "Unknown Staff";
                    const time = timeMatch ? timeMatch[1] : "Unknown";

                    // Green for Approval (3066993) | Red for Denial (15158332)
                    const finalColor = isApproved ? 3066993 : 15158332;
                    const statusText = isApproved ? '✅ Approved' : '❌ Denied';

                    // Re-build original embed cards with color changes
                    const updatedEmbeds = [
                        {
                            "color": finalColor,
                            "image": originalEmbeds[0]?.image || null
                        },
                        {
                            "title": targetEmbed.title,
                            "description": `> **Host:** ${host}\n> **Flight ID:** \`${flightId}\`\n> **Route:** \`${route}\`\n> **Time:** \`${time}\`\n\n**Status:** ${statusText}\n**Staff Notes:** *${staffNotes}*`,
                            "color": finalColor,
                            "image": targetEmbed.image || null,
                            "thumbnail": targetEmbed.thumbnail || null,
                            "footer": { "text": `Reviewed by ${interaction.user.tag}`, "icon_url": interaction.user.displayAvatarURL() }
                        }
                    ];

                    // Wipe out active buttons and update the message
                    await interaction.editReply({
                        content: `Flight request reviewed by ${interaction.user}.`,
                        embeds: updatedEmbeds,
                        components: [] // Erases buttons instantly
                    });

                    // Update official log channel layout
                    const logChannelId = '1509542966614818897';
                    const logChannel = interaction.client.channels.cache.get(logChannelId) || await interaction.client.channels.fetch(logChannelId).catch(() => null);

                    if (logChannel) {
                        const finalLogEmbed = [
                            {
                                "title": isApproved ? "🟢 Flight Approved Logistics" : "🔴 Flight Denied Logistics",
                                "description": `**Host:** ${host}\n**Flight ID:** \`${flightId}\`\n**Route:** \`${route}\`\n**Time:** \`${time}\`\n\n**Action By:** ${interaction.user}\n**Staff Comments:** \`${staffNotes}\``,
                                "color": finalColor,
                                "thumbnail": targetEmbed.thumbnail || null,
                                "timestamp": new Date().toISOString()
                            }
                        ];
                        await logChannel.send({ embeds: finalLogEmbed });
                    }
                }
            }
            
        } catch (error) {
            // IF IT FAILS, THIS WILL PRINT EXACTLY WHY TO YOUR TERMINAL
            console.error('\n❌ [CRITICAL ERROR] Interaction failed!');
            console.error(error);
            console.error('----------------------------------------\n');
            
            // Try to let the user know cleanly instead of "Interaction Failed"
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'There was an internal error processing that request. Check the bot console.', ephemeral: true }).catch(() => null);
            }
        }
    },
};