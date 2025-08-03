const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Get info on a specific role')
    .addRoleOption(option => option.setName('role').setDescription('Role to view').setRequired(true)),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const embed = {
      title: `Role Info for ${role.name}`,
      fields: [
        { name: 'Role Name', value: role.name, inline: true },
        { name: 'Role ID', value: role.id, inline: true },
        { name: 'Created At', value: role.createdAt.toDateString(), inline: true },
        { name: 'Position', value: role.position, inline: true },
      ],
      color: role.color
    };
    await interaction.reply({ embeds: [embed] });
  }
};