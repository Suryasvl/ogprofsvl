const { SlashCommandBuilder } = require('discord.js');

const afkMap = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set your AFK status')
    .addStringOption(option =>
      option.setName('reason').setDescription('Why are you AFK?').setRequired(false)),

  async execute(interaction) {
    const reason = interaction.options.getString('reason') || 'AFK';
    afkMap.set(interaction.user.id, reason);
    await interaction.reply(`You are now AFK: **${reason}**`);
  }
};