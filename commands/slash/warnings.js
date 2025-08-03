// commands/slash/warnings.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Show warnings for a user')
    .addUserOption(opt => opt.setName('user').setDescription('User').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    await interaction.reply(`${user.tag} has 0 warnings.`);
  }
};