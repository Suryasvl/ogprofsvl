
const fs = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'autonick',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ You need Administrator permissions to use this command.');
        }

        const configPath = path.join(__dirname, '../../autonick.json');
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        const guildId = message.guild.id;
        if (!config[guildId]) config[guildId] = { enabled: false, format: null };

        if (!args[0]) {
            const status = config[guildId].enabled ? 'ON' : 'OFF';
            const format = config[guildId].format || 'Not set';
            return message.reply(`🏷️ **Auto Nickname Status:** ${status}\n📝 **Format:** ${format}\n\n**Usage:**\n\`autonick on [format]\` - Enable with format\n\`autonick off\` - Disable\n\n**Format placeholders:**\n\`{displayname}\` - User's display name\n\`{username}\` - User's username\n\`{tag}\` - User's discriminator\n\nExample: \`autonick on [Member] {displayname}\``);
        }

        if (args[0].toLowerCase() === 'off') {
            config[guildId].enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return message.reply('✅ Auto nickname has been disabled.');
        }

        if (args[0].toLowerCase() === 'on') {
            if (!args[1]) {
                return message.reply('❌ Please provide a format. Example: `autonick on [Member] {displayname}`');
            }

            const format = args.slice(1).join(' ');
            config[guildId].enabled = true;
            config[guildId].format = format;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return message.reply(`✅ Auto nickname enabled with format: \`${format}\``);
        }

        message.reply('❌ Invalid option. Use `on` or `off`.');
    }
};