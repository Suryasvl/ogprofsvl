const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a yes/no poll')
    .addStringOption(opt =>
      opt.setName('question').setDescription('The poll question').setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const msg = await interaction.reply({ content: `📊 **Poll:** ${question}`, fetchReply: true });
    await msg.react('👍');
    await msg.react('👎');
  }
};