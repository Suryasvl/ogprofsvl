// commands/slash/emojilist.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojilist')
    .setDescription('List all server emojis'),

  async execute(interaction) {
    const emojis = interaction.guild.emojis.cache.map(e => e.toString()).join(' ');
    await interaction.reply(`😀 Emojis:\n${emojis || 'No emojis in this server.'}`);
  }
};