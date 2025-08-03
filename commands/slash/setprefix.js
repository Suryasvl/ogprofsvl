
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Change the bot prefix for this server')
    .addStringOption(option =>
      option.setName('prefix')
        .setDescription('The new prefix (max 3 characters)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const newPrefix = interaction.options.getString('prefix');

    if (newPrefix.length > 3) {
      return await interaction.reply({ content: '❌ Prefix must be 3 characters or less!', ephemeral: true });
    }

    // Save prefix to a JSON file
    const configPath = path.join(__dirname, '../../config.json');
    let config = {};
    
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    if (!config.guilds) config.guilds = {};
    config.guilds[interaction.guild.id] = { prefix: newPrefix };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    await interaction.reply(`✅ Prefix changed to \`${newPrefix}\`! Restart the bot for changes to take effect.`);
  },
};
