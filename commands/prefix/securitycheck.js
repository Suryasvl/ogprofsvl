const fs = require("fs");
const path = "./security.json";

module.exports = {
  name: "securitycheck",
  description: "Check your server's security status",
  execute(message) {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

    const data = JSON.parse(fs.readFileSync(path));
    const guildId = message.guild.id;

    const settings = data[guildId] || {
      antiLink: false,
      antiSpam: false,
      antiRaid: false,
      autoNick: false,
      autoRole: false,
      welcome: false
    };

    const enabled = Object.values(settings).filter(Boolean).length;
    const total = Object.keys(settings).length;
    const percent = Math.round((enabled / total) * 100);

    const status = Object.entries(settings)
      .map(([key, value]) => `🔹 **${key}**: ${value ? "✅ ON" : "❌ OFF"}`)
      .join("\n");

    const suggestions = Object.entries(settings)
      .filter(([_, value]) => !value)
      .map(([key]) => `• Enable **${key}** for better protection.`)
      .join("\n") || "🎉 All core security features are active. Great job!";

    message.channel.send({
      embeds: [{
        title: "🔐 Server Security Check",
        description: `${status}\n\n**🔰 Safety Score:** ${percent}%\n\n💡 **Suggestions:**\n${suggestions}`,
        color: 0x00ff99
      }]
    });
  }
};