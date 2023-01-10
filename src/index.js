import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import dotenv from "dotenv";
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });


dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const TOKEN = process.env.TOKEN;

import commands from "./commands/index.js";
import modals from "./modals/index.js";

const rest = new REST({ version: "10" }).setToken(TOKEN);
(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();

bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.tag}`);
});

bot.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand() && !interaction.isModalSubmit()) return;
    const action = interaction.isChatInputCommand() ? commands.find(cmd => cmd.name === interaction.commandName) : modals.find(modal => modal.customId === interaction.customId);
    if (!action) return;
    try {
        action.callback(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "An error occured", ephemeral: true });
    }
});

bot.login(TOKEN);
