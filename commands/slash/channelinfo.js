// commands/slash/channelinfo.js
const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channelinfo')
    .setDescription('Get info about this channel'),

  async execute(interaction) {
    const channel = interaction.channel;
    await interaction.reply(`ℹ️ **Channel Info**
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Topic: ${channel.topic || 'None'}`);
  }
};