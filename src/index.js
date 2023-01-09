const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const commands = require("./commands");
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const TOKEN = process.env.TOKEN;

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
    if (!interaction.isChatInputCommand()) return;
    const command = commands.find(cmd => cmd.name === interaction.commandName);
    if (!command) return;
    try {
        command.callback(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
});
bot.login(TOKEN);