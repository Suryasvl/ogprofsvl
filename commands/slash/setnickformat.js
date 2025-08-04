// setnickformat.js (inside your slash commands folder)

const fs = require("fs");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setnickformat")
    .setDescription("Set the nickname format for new members")
    .addStringOption(option =>
      option
        .setName("format")
        .setDescription("Enter format with {username}")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({ content: "Only admins can use this!", ephemeral: true });
    }

    const format = interaction.options.getString("format");

    if (!format.includes("{username}")) {
      return interaction.reply({ content: "Format must include `{username}`!", ephemeral: true });
    }

    fs.writeFileSync("autonick.json", JSON.stringify({ format }, null, 2));
    await interaction.reply(`✅ Nickname format set to: \`${format}\``);
  },
};