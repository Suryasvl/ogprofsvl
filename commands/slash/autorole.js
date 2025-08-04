const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole')
        .setDescription('Configure auto role for new members')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('on')
                .setDescription('Enable auto role with specified role')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Role to assign to new members')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('off')
                .setDescription('Disable auto role'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check current auto role settings')),

    async execute(interaction) {
        const configPath = path.join(__dirname, '../../autorole.json');
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        const guildId = interaction.guild.id;
        if (!config[guildId]) config[guildId] = { enabled: false, roleId: null };

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'status') {
            const status = config[guildId].enabled ? 'ON' : 'OFF';
            const role = config[guildId].roleId ? `<@&${config[guildId].roleId}>` : 'Not set';
            return await interaction.reply(`🎭 **Auto Role Status:** ${status}\n👤 **Role:** ${role}`);
        }

        if (subcommand === 'off') {
            config[guildId].enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return await interaction.reply('✅ Auto role has been disabled.');
        }

        if (subcommand === 'on') {
            const role = interaction.options.getRole('role');

            if (role.position >= interaction.guild.members.me.roles.highest.position) {
                return await interaction.reply('❌ I cannot assign this role because it is higher than or equal to my highest role.');
            }

            config[guildId].enabled = true;
            config[guildId].roleId = role.id;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return await interaction.reply(`✅ Auto role enabled. New members will receive the ${role} role.`);
        }
    }
};