const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Get bot\'s uptime'),

  async execute(interaction) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    await interaction.reply(`⏱ Bot uptime: ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`);
  }
};