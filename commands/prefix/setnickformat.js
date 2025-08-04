// ssetnickformat.js (inside your prefix commands folder)

const fs = require("fs");

module.exports = {
  name: "setnickformat",
  description: "Set auto nickname format for new members.",
  execute(message, args) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("Only admins can set the nickname format!");
    }

    const format = args.join(" ");
    if (!format.includes("{username}")) {
      return message.reply("Format must include `{username}` placeholder.");
    }

    fs.writeFileSync("autonick.json", JSON.stringify({ format }, null, 2));
    message.reply(`✅ Nickname format set to: \`${format}\``);
  },
};