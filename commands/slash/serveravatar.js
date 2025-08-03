const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serveravatar')
    .setDescription('Displays the server\'s icon'),

  async execute(interaction) {
    const icon = interaction.guild.iconURL({ dynamic: true, size: 1024 });
    if (!icon) return interaction.reply('❌ This server has no icon.');
    await interaction.reply(icon);
  }
};