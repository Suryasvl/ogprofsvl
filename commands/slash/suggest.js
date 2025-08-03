const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Send a suggestion')
    .addStringOption(option =>
      option.setName('text').setDescription('Your suggestion').setRequired(true)),

  async execute(interaction) {
    const text = interaction.options.getString('text');
    const embed = new EmbedBuilder()
      .setTitle('📬 New Suggestion')
      .setDescription(text)
      .setFooter({ text: `From ${interaction.user.tag}` })
      .setColor('Blue');

    const suggestionChannel = interaction.guild.channels.cache.find(ch => ch.name.includes('suggest'));
    if (!suggestionChannel) return interaction.reply({ content: 'Suggestion channel not found.', ephemeral: true });

    suggestionChannel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Suggestion sent!', ephemeral: true });
  }
};