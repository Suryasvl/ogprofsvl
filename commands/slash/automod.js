
// commands/slash/automod.js
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Enable or disable AutoMod")
    .addStringOption(opt =>
      opt.setName("mode")
        .setDescription("on or off")
        .setRequired(true)
        .addChoices(
          { name: "on", value: "on" },
          { name: "off", value: "off" }
        )),
  async execute(interaction) {
    if (!interaction.member.permissions.has("Administrator"))
      return interaction.reply({ content: "❌ You need `Administrator` permission.", ephemeral: true });

    const mode = interaction.options.getString("mode");
    const dataPath = path.join(__dirname, "../../data/automod.json");
    let config = {};
    if (fs.existsSync(dataPath)) config = JSON.parse(fs.readFileSync(dataPath));

    config[interaction.guild.id] = mode === "on";
    fs.writeFileSync(dataPath, JSON.stringify(config, null, 2));

    await interaction.reply({
      embeds: [{
        title: "🛡️ AutoMod Updated",
        description: `AutoMod has been **${mode.toUpperCase()}**.`,
        color: mode === "on" ? 0x00ff00 : 0xff0000
      }]
    });
  }
};