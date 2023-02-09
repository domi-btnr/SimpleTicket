import { ChannelType, PermissionFlagsBits } from "discord.js";

import { SettingsStore, TicketStore } from "../store.js";

const customId = "createTicketModal";
const callback = async interaction => {
    try {
        const subject = interaction.fields.getTextInputValue("ticketTitle");
        const description = interaction.fields.getTextInputValue("ticketDescription");

        const settings = new SettingsStore();
        const tickets = new TicketStore();
        const ticketCategory = settings.get(interaction.guildId, "TICKET_CATEGORY");
        const maxTicketsPerUser = settings.get(interaction.guildId, "MAX_TICKETS_PER_USER");
        const staffRole = settings.get(interaction.guildId, "STAFF_ROLE");

        const category = interaction.guild.channels.cache.find(channel => (ticketCategory ? channel.id === ticketCategory : (channel.name.toLowerCase() === "tickets" || channel.name.toLowerCase() === "support")) && channel.type === ChannelType.GuildCategory);
        if (!category) return interaction.reply({ content: "Your ticket couldn't  be created", ephemeral: true });

        const ticketsByUser = tickets.getTickets(interaction.guildId).filter(ticket => ticket.user === interaction.user.id);
        if (ticketsByUser && ticketsByUser.length >= maxTicketsPerUser) return interaction.reply({ content: "You have reached the maximum amount of tickets you can have", ephemeral: true });

        const PERMS = {
            DENY: [PermissionFlagsBits.ViewChannel],
            ALLOW: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles]
        };

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: PERMS.DENY
                },
                {
                    id: interaction.client.user.id,
                    allow: PERMS.ALLOW
                },
                {
                    id: interaction.user.id,
                    allow: PERMS.ALLOW
                },
                {
                    id: staffRole,
                    allow: PERMS.ALLOW
                }
            ].filter(perm => perm.id !== undefined)
        });

        tickets.addTicket(interaction.guildId, {
            id: channel.id,
            createdAt: Date.now(),
            user: interaction.user.id
        });

        const webhook = await channel.createWebhook({
            avatar: interaction.user.avatarURL(),
            name: interaction.user.username
        });
        webhook.send({ content: `**${subject}**\n${description}${staffRole ? `\n\n||<@&${staffRole}>||` : ""}` });

        await interaction.reply({ content: `Your ticket has been created! You can view it here: ${channel}`, ephemeral: true });
    } catch (error) {
        console.error(`[ERROR] ${error.message}`);
    }
};

export default { customId, callback };
