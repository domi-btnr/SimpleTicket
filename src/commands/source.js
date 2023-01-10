import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
    .setName("source")
    .setDescription("Get the source code of the bot");

const callback = interaction => {
    interaction.reply("Here's the source code of the bot:\n<https://github.com/HypedDomi/SimpleTicket>");
};

export default { ...command.toJSON(), callback };
