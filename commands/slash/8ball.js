// commands/slash/8ball.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8-ball a question')
    .addStringOption(opt => opt.setName('question').setDescription('Your question').setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const answers = ["Yes", "No", "Maybe", "Definitely", "Ask again later"];
    const response = answers[Math.floor(Math.random() * answers.length)];
    await interaction.reply(`🎱 ${response}`);
  }
};