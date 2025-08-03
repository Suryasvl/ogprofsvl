const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = './staff.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staffdata')
    .setDescription('Show full staff attendance data'),
  async execute(interaction) {
    if (!fs.existsSync(path)) return interaction.reply('❌ No attendance data found.');

    const data = JSON.parse(fs.readFileSync(path));
    let msg = '**📋 Staff Attendance Data:**\n\n';
    for (const id in data) {
      msg += `👤 **${data[id].name}** - 🕒 ${data[id].timestamp}\n`;
    }

    await interaction.reply(msg);
  }
};