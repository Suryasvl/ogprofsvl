const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dnd')
    .setDescription('Set yourself to Do Not Disturb mode')
    .addIntegerOption(option =>
      option.setName('minutes').setDescription('Duration in minutes').setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const minutes = interaction.options.getInteger('minutes');
    const returnTime = Date.now() + minutes * 60000;

    let dnd = {};
    if (fs.existsSync('./dnd.json')) {
      dnd = JSON.parse(fs.readFileSync('./dnd.json', 'utf8'));
    }

    dnd[userId] = returnTime;
    fs.writeFileSync('./dnd.json', JSON.stringify(dnd));

    await interaction.reply(`${interaction.user.tag} is now DND for ${minutes} minutes.`);
  }
};