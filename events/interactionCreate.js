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

            // --- 2. BUTTON INTERACTION ROUTER ---
            else if (interaction.isButton()) {
                
                // A. WELCOME BUTTON LOGIC
                if (interaction.customId.startsWith('welcome_btn_')) {
                    const newUserId = interaction.customId.split('_')[2];
                    return await interaction.reply({ 
                        content: `${interaction.user.toString()} welcomes <@${newUserId}> to the airline! ✈️`, 
                        allowedMentions: { users: [newUserId] } 
                    });
                }

                // B. FLIGHT APPROVAL/DENIAL BUTTON LOGIC
                if (interaction.customId === 'flight_approve' || interaction.customId === 'flight_deny') {
                    if (!interaction.member) {
                        return interaction.reply({ content: '❌ Error: Cannot verify your roles. Please try again.', ephemeral: true });
                    }

                    const allowedRoles = ['1506944158865166336', '1507599514721058876'];
                    const hasPermission = interaction.member.roles.cache.some(role => allowedRoles.includes(role.id));
                    
                    if (!hasPermission) {
                        return interaction.reply({ content: '🚫 You do not have permission to review flight requests.', ephemeral: true });
                    }

                    const action = interaction.customId === 'flight_approve' ? 'approve' : 'deny';
                    const modal = new ModalBuilder()
                        .setCustomId(`modal_flight_${action}`)
                        .setTitle(action === 'approve' ? 'Confirm Flight Approval' : 'Confirm Flight Denial');

                    const textInput = new TextInputBuilder()
                        .setCustomId('flight_reason')
                        .setLabel(action === 'approve' ? 'Optional Notes' : 'Reason for Denial')
                        .setPlaceholder('Type your comments here...')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(action === 'deny');

                    modal.addComponents(new ActionRowBuilder().addComponents(textInput));
                    await interaction.showModal(modal);
                }
            }

            // --- 3. MODAL SUBMISSION ROUTER ---
            else if (interaction.isModalSubmit()) {
                if (interaction.customId.startsWith('modal_flight_')) {
                    await interaction.deferUpdate();

                    const isApproved = interaction.customId === 'modal_flight_approve';
                    const staffNotes = interaction.fields.getTextInputValue('flight_reason') || 'No additional notes provided.';
                    
                    const originalEmbeds = interaction.message.embeds;
                    if (!originalEmbeds || originalEmbeds.length === 0) return;

                    const targetEmbed = originalEmbeds.length > 1 ? originalEmbeds[1] : originalEmbeds[0];
                    const desc = targetEmbed.description || "";

                    const flightId = desc.match(/\*\*Flight ID:\*\* `([^`]+)`/)?.[1] || "Unknown";
                    const route = desc.match(/\*\*Route:\*\* `([^`]+)`/)?.[1] || "Unknown";
                    const host = desc.match(/\*\*Host:\*\* (<@!?\d+>)/)?.[1] || "Unknown Staff";
                    const time = desc.match(/\*\*Time:\*\* `([^`]+)`/)?.[1] || "Unknown";

                    const finalColor = isApproved ? 3066993 : 15158332;
                    const statusText = isApproved ? '✅ Approved' : '❌ Denied';

                    const updatedEmbeds = [
                        { "color": finalColor, "image": originalEmbeds[0]?.image || null },
                        {
                            "title": targetEmbed.title,
                            "description": `> **Host:** ${host}\n> **Flight ID:** \`${flightId}\`\n> **Route:** \`${route}\`\n> **Time:** \`${time}\`\n\n**Status:** ${statusText}\n**Staff Notes:** *${staffNotes}*`,
                            "color": finalColor,
                            "image": targetEmbed.image || null,
                            "thumbnail": targetEmbed.thumbnail || null,
                            "footer": { "text": `Reviewed by ${interaction.user.tag}`, "icon_url": interaction.user.displayAvatarURL() }
                        }
                    ];

                    await interaction.editReply({
                        content: `Flight request reviewed by ${interaction.user}.`,
                        embeds: updatedEmbeds,
                        components: []
                    });

                    const logChannel = interaction.client.channels.cache.get('1509542966614818897');
                    if (logChannel) {
                        await logChannel.send({ embeds: [{
                            "title": isApproved ? "🟢 Flight Approved Logistics" : "🔴 Flight Denied Logistics",
                            "description": `**Host:** ${host}\n**Flight ID:** \`${flightId}\`\n**Route:** \`${route}\`\n**Time:** \`${time}\`\n\n**Action By:** ${interaction.user}\n**Staff Comments:** \`${staffNotes}\``,
                            "color": finalColor,
                            "thumbnail": targetEmbed.thumbnail || null,
                            "timestamp": new Date().toISOString()
                        }]});
                    }
                }
            }
            
        } catch (error) {
            console.error('\n❌ [CRITICAL ERROR] Interaction failed!');
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Internal error.', ephemeral: true }).catch(() => null);
            }
        }
    },
};