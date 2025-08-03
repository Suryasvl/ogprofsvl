const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = './staff.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staffmark')
    .setDescription('Mark your staff attendance'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const name = interaction.user.tag;
    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    data[userId] = { name, timestamp };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    await interaction.reply(`✅ <@${userId}> marked attendance at ${timestamp}`);
  }
};