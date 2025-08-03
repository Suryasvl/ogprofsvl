module.exports = {
  name: 'membercount',
  execute: (message) => {
    message.channel.send(`👥 This server has **${message.guild.memberCount}** members.`);
  }
};