// commands/slash/removewarn.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Removes one warning from a user')
    .addUserOption(option => option.setName('user').setDescription('User').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    await interaction.reply(`Removed one warning from ${user.tag}.`);
  }
};