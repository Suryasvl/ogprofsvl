module.exports = {
  name: 'serveravatar',
  execute: (message) => {
    const icon = message.guild.iconURL({ dynamic: true, size: 1024 });
    if (!icon) return message.channel.send('❌ This server has no icon.');
    message.channel.send(icon);
  }
};