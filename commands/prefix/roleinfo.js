module.exports = {
  name: 'roleinfo',
  execute: (message, args) => {
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) return message.reply('Please mention a valid role or provide the role ID.');

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
    message.channel.send({ embeds: [embed] });
  }
};