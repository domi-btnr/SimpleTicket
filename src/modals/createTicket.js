import { ChannelType, PermissionFlagsBits } from "discord.js";

import { SettingsStore } from "../store.js";

const customId = "createTicketModal";
const callback = async interaction => {
    try {
        const subject = interaction.fields.getTextInputValue("ticketTitle");
        const description = interaction.fields.getTextInputValue("ticketDescription");

        const store = new SettingsStore();
        const ticketCategory = store.get(interaction.guildId, "TICKET_CATEGORY");
        // const maxTicketsPerUser = store.get(interaction.guildId, "MAX_TICKETS_PER_USER");
        const staffRole = store.get(interaction.guildId, "STAFF_ROLE");

        const category = interaction.guild.channels.cache.find(channel => (ticketCategory ? channel.id === ticketCategory : (channel.name.toLowerCase() === "tickets" || channel.name.toLowerCase() === "support")) && channel.type === ChannelType.GuildCategory);
        if (!category) return interaction.reply({ content: "Your ticket couldn't  be created", ephemeral: true });

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                }
            ]
        });

        const webhook = await channel.createWebhook({
            avatar: interaction.user.avatarURL(),
            name: interaction.user.username
        });
        webhook.send({ content: `**${subject}**\n${description}${staffRole ? `\n\n||<@&${staffRole}>||` : ""}` });

        await interaction.reply({ content: `Your ticket has been created! You can view it here: ${channel}`, ephemeral: true });
    } catch (error) {
        throw new Error(error);
    }
};

export default { customId, callback };
