const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = './staff.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staffactivity')
    .setDescription('Check staff activity')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Staff member')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    const record = data[user.id];

    if (!record) return interaction.reply('❌ No attendance record for this user.');
    await interaction.reply(`🧾 **${record.name}** was last marked present at 🕒 ${record.timestamp}`);
  }
};