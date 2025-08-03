const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear messages from the channel')
    .addIntegerOption(option =>
      option.setName('amount').setDescription('Number of messages to delete').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    if (amount > 100 || amount < 1) return interaction.reply('You can delete between 1 and 100 messages.');
    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply(`🧹 Deleted ${amount} messages`);
  }
};