const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = './staff.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staffreset')
    .setDescription('Reset staff attendance')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (fs.existsSync(path)) fs.unlinkSync(path);
    await interaction.reply('✅ Staff attendance has been reset.');
  }
};