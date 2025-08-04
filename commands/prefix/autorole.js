
const fs = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'autorole',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ You need Administrator permissions to use this command.');
        }

        const configPath = path.join(__dirname, '../../autorole.json');
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        const guildId = message.guild.id;
        if (!config[guildId]) config[guildId] = { enabled: false, roleId: null };

        if (!args[0]) {
            const status = config[guildId].enabled ? 'ON' : 'OFF';
            const role = config[guildId].roleId ? `<@&${config[guildId].roleId}>` : 'Not set';
            return message.reply(`🎭 **Auto Role Status:** ${status}\n👤 **Role:** ${role}\n\n**Usage:**\n\`autorole on <@role>\` - Enable with role\n\`autorole off\` - Disable`);
        }

        if (args[0].toLowerCase() === 'off') {
            config[guildId].enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return message.reply('✅ Auto role has been disabled.');
        }

        if (args[0].toLowerCase() === 'on') {
            const role = message.mentions.roles.first();
            if (!role) {
                return message.reply('❌ Please mention a role. Example: `autorole on @Member`');
            }

            if (role.position >= message.guild.members.me.roles.highest.position) {
                return message.reply('❌ I cannot assign this role because it is higher than or equal to my highest role.');
            }

            config[guildId].enabled = true;
            config[guildId].roleId = role.id;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return message.reply(`✅ Auto role enabled. New members will receive the ${role} role.`);
        }

        message.reply('❌ Invalid option. Use `on` or `off`.');
    }
};