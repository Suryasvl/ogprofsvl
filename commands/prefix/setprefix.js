
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'setprefix',
  execute: async (message, args) => {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ You need Administrator permissions to change the prefix!');
    }

    const newPrefix = args[0];
    if (!newPrefix) {
      return message.reply('❌ Please provide a new prefix! Usage: `s setprefix <new_prefix>`');
    }

    if (newPrefix.length > 3) {
      return message.reply('❌ Prefix must be 3 characters or less!');
    }

    // Save prefix to a JSON file
    const configPath = path.join(__dirname, '../../config.json');
    let config = {};
    
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    if (!config.guilds) config.guilds = {};
    config.guilds[message.guild.id] = { prefix: newPrefix };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    message.reply(`✅ Prefix changed to \`${newPrefix}\`! Restart the bot for changes to take effect.`);
  },
};
