import { ActionRowBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const command = new SlashCommandBuilder()
    .setName("create-ticket")
    .setDescription("Create a ticket");

const callback = async interaction => {
    const modal = new ModalBuilder()
        .setCustomId("createTicketModal")
        .setTitle("Create a ticket");

    const ticketTitle = new TextInputBuilder()
        .setCustomId("ticketTitle")
        .setLabel("Subject")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("e.g. I can't join the server")
        .setMaxLength(100);

    const ticketDescription = new TextInputBuilder()
        .setCustomId("ticketDescription")
        .setLabel("Explain your problem")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("e.g. I can't join the server because I'm not whitelisted");

    const titleActionRow = new ActionRowBuilder().addComponents(ticketTitle);
    const descriptionActionRow = new ActionRowBuilder().addComponents(ticketDescription);
    modal.addComponents(titleActionRow, descriptionActionRow);
    await interaction.showModal(modal);
};

export default { ...command.toJSON(), callback };
