// commands/slash/roles.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('List all roles in the server (ordered by hierarchy)'),

  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .sort((a, b) => b.position - a.position) // Sort top to bottom
      .map(role => role.toString())
      .join(' ');

    await interaction.reply(`📜 **Server Roles:**\n${roles}`);
  }
};