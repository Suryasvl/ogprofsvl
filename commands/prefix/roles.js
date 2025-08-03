// commands/prefix/roles.js
module.exports = {
  name: "roles",
  execute(message) {
    const roles = message.guild.roles.cache
      .sort((a, b) => b.position - a.position) // Sort by hierarchy
      .map(role => role.toString())
      .join(' ');

    message.channel.send(`📜 **Server Roles:**\n${roles}`);
  }
};