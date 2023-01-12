import { ChannelType, SlashCommandBuilder } from "discord.js";

import { SettingsStore } from "../store.js";

const command = new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Change the settings of the bot")
    .addSubcommand(subcommand =>
        subcommand.setName("max-tickets-per-user")
            .setDescription("Change the maximum amount of tickets a user can have")
            .addIntegerOption(option =>
                option.setName("amount")
                    .setDescription("The new maximum amount of tickets a user can have")
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("staff-role")
            .setDescription("Change the staff role")
            .addRoleOption(option =>
                option.setName("role")
                    .setDescription("The new staff role")
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand.setName("ticket-category")
            .setDescription("Change the ticket category")
            .addStringOption(option =>
                option.setName("category")
                    .setDescription("The new ticket category")
                    .setRequired(true)
                    .setAutocomplete(true)
            )
    );

const autocomplete = async interaction => {
    if (interaction.options._subcommand === "ticket-category") {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const categories = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory);
        const filtered = categories.filter(choice => choice.name.toLowerCase().startsWith(focusedValue));
        await interaction.respond(filtered.map(channel => ({ name: channel.name, value: channel.id })));
    }
};

const store = new SettingsStore();
const callback = interaction => {
    store.set(interaction.guildId, interaction.options._subcommand.toUpperCase().replace("-", "_"), interaction.options._hoistedOptions[0].value);
    let response;
    switch (interaction.options._subcommand) {
        case "max-tickets-per-user":
            response = `The maximum amount of tickets a user can have is now ${interaction.options._hoistedOptions[0].value}`;
            break;
        case "staff-role":
            response = `The staff role is now <@&${interaction.options._hoistedOptions[0].value}>`;
            break;
        case "ticket-category":
            response = `The ticket category is now <#${interaction.options._hoistedOptions[0].value}>`;
            break;
    }
    interaction.reply(response ?? "Something went wrong");
};

export default { ...command.toJSON(), autocomplete, callback };
