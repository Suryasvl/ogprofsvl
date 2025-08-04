
// commands/prefix/automod.js
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "automod",
  description: "Enable or disable AutoMod features.",
  async execute(message, args) {
    if (!message.member.permissions.has("Administrator"))
      return message.reply("❌ You need `Administrator` permission.");

    const dataPath = path.join(__dirname, "../../data/automod.json");
    let config = {};
    if (fs.existsSync(dataPath)) config = JSON.parse(fs.readFileSync(dataPath));

    const guildId = message.guild.id;

    if (!args[0] || !["on", "off"].includes(args[0].toLowerCase()))
      return message.reply("❗ Usage: `sautomod on` or `sautomod off`");

    config[guildId] = args[0].toLowerCase() === "on";
    fs.writeFileSync(dataPath, JSON.stringify(config, null, 2));

    message.channel.send({
      embeds: [{
        title: "🔒 AutoMod Status",
        description: `AutoMod has been **${config[guildId] ? "Enabled" : "Disabled"}** for this server.`,
        color: config[guildId] ? 0x00ff00 : 0xff0000
      }]
    });
  }
};