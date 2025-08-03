// commands/prefix/removewarn.js
module.exports = {
  name: "removewarn",
  execute(message) {
    const user = message.mentions.users.first();
    if (!user) return message.reply("Please mention a user to remove a warning.");
    message.channel.send(`Removed one warning from ${user.tag}.`);
  }
};