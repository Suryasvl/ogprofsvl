// commands/slash/pingrole.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pingrole')
    .setDescription('Mention a role')
    .addRoleOption(opt => opt.setName('role').setDescription('Role to ping').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    await interaction.reply(`${role}`);
  }
};