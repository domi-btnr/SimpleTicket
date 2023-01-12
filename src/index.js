import { Client, GatewayIntentBits, InteractionType, REST, Routes } from "discord.js";
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
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        const cmd = commands.find(cmd => cmd.name === interaction.commandName);
        if (cmd) await cmd.autocomplete(interaction);
    } else {
        let action = null;
        switch (interaction.type) {
            case InteractionType.ApplicationCommand:
                action = commands.find(cmd => cmd.name === interaction.commandName);
                break;
            case InteractionType.ModalSubmit:
                action = modals.find(modal => modal.customId === interaction.customId);
                break;
        }
        if (!action) return;
        try {
            action.callback(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "An error occured", ephemeral: true });
        }
    }
});

bot.login(TOKEN);
