// commands/prefix/pingrole.js
module.exports = {
  name: "pingrole",
  execute(message) {
    const role = message.mentions.roles.first();
    if (!role) return message.reply("Mention a role to ping.");
    message.channel.send(`${role}`);
  }
};