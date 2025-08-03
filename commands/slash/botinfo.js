// commands/slash/botinfo.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Get info about the bot'),

  async execute(interaction) {
    const uptime = process.uptime();
    await interaction.reply(`🤖 **Bot Info**
- Uptime: ${Math.floor(uptime)} seconds
- Servers: ${interaction.client.guilds.cache.size}
- Users: ${interaction.client.users.cache.size}`);
  }
};