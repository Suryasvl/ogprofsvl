
const fs = require('fs');
const path = require('path');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'welcome',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ You need Administrator permissions to use this command.');
        }

        const configPath = path.join(__dirname, '../../welcome.json');
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        const guildId = message.guild.id;
        if (!config[guildId]) config[guildId] = { enabled: false, channelId: null, title: null, description: null, color: null };

        if (!args[0]) {
            const status = config[guildId].enabled ? 'ON' : 'OFF';
            const channel = config[guildId].channelId ? `<#${config[guildId].channelId}>` : 'Not set';
            return message.reply(`🎉 **Welcome Status:** ${status}\n📢 **Channel:** ${channel}\n\n**Usage:**\n\`welcome on #channel\` - Enable welcome messages\n\`welcome off\` - Disable\n\`welcome set\` - Configure message\n\`welcome test\` - Test current setup`);
        }

        if (args[0].toLowerCase() === 'off') {
            config[guildId].enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return message.reply('✅ Welcome messages have been disabled.');
        }

        if (args[0].toLowerCase() === 'on') {
            const channel = message.mentions.channels.first();
            if (!channel) {
                return message.reply('❌ Please mention a channel. Example: `welcome on #general`');
            }

            config[guildId].enabled = true;
            config[guildId].channelId = channel.id;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return message.reply(`✅ Welcome messages enabled in ${channel}.`);
        }

        if (args[0].toLowerCase() === 'set') {
            return message.reply('🔧 **Welcome Message Setup:**\n\nPlease provide the following in order:\n1. **Title** (or "skip")\n2. **Description** (use {user} for mention, {username} for name, {server} for server name)\n3. **Color** (hex code like #ff0000 or "skip")\n\nExample: `welcome set "Welcome!" "Hello {user}, welcome to {server}!" #00ff00`');
        }

        if (args[0].toLowerCase() === 'test') {
            if (!config[guildId].enabled) {
                return message.reply('❌ Welcome messages are disabled. Enable them first.');
            }

            const channel = message.guild.channels.cache.get(config[guildId].channelId);
            if (!channel) {
                return message.reply('❌ Welcome channel not found.');
            }

            const embed = new EmbedBuilder()
                .setTitle(config[guildId].title || '🎉 Welcome!')
                .setDescription((config[guildId].description || 'Welcome {user} to **{server}**! 🌟').replace('{user}', message.author).replace('{username}', message.author.username).replace('{server}', message.guild.name))
                .setColor(config[guildId].color || '#00ff00')
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter({ text: `Member #${message.guild.memberCount}` })
                .setTimestamp();

            return channel.send({ embeds: [embed] });
        }

        // Handle setting welcome message
        if (args.length >= 3) {
            const title = args[1] === 'skip' ? null : args[1].replace(/"/g, '');
            const description = args[2] === 'skip' ? null : args[2].replace(/"/g, '');
            const color = args[3] === 'skip' || !args[3] ? null : args[3];

            config[guildId].title = title;
            config[guildId].description = description;
            config[guildId].color = color;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return message.reply('✅ Welcome message configuration updated!');
        }

        message.reply('❌ Invalid option. Use `on`, `off`, `set`, or `test`.');
    }
};