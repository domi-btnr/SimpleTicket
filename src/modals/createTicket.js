import { ChannelType, PermissionFlagsBits } from "discord.js";

const customId = "createTicketModal";
const callback = async interaction => {
    const subject = interaction.fields.getTextInputValue("ticketTitle");
    const description = interaction.fields.getTextInputValue("ticketDescription");

    const category = interaction.guild.channels.cache.find(channel => (channel.name.toLowerCase() === "tickets" || channel.name.toLowerCase() === "support") && channel.type === ChannelType.GuildCategory);
    if (!category)
        return interaction.reply({ content: "Your ticket couldn't  be created", ephemeral: true });

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
    webhook.send({ content: `**${subject}**\n${description}` });

    await interaction.reply({ content: `Your ticket has been created! You can view it here: ${channel}`, ephemeral: true });
};

export default { customId, callback };
