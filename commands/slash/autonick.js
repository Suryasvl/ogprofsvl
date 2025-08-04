const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autonick')
        .setDescription('Configure auto nickname for new members')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('on')
                .setDescription('Enable auto nickname with format')
                .addStringOption(option =>
                    option.setName('format')
                        .setDescription('Nickname format (use {displayname}, {username}, {tag})')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('off')
                .setDescription('Disable auto nickname'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check current auto nickname settings')),

    async execute(interaction) {
        const configPath = path.join(__dirname, '../../autonick.json');
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        const guildId = interaction.guild.id;
        if (!config[guildId]) config[guildId] = { enabled: false, format: null };

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'status') {
            const status = config[guildId].enabled ? 'ON' : 'OFF';
            const format = config[guildId].format || 'Not set';
            return await interaction.reply(`🏷️ **Auto Nickname Status:** ${status}\n📝 **Format:** ${format}\n\n**Format placeholders:**\n\`{displayname}\` - User's display name\n\`{username}\` - User's username\n\`{tag}\` - User's discriminator`);
        }

        if (subcommand === 'off') {
            config[guildId].enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return await interaction.reply('✅ Auto nickname has been disabled.');
        }

        if (subcommand === 'on') {
            const format = interaction.options.getString('format');
            config[guildId].enabled = true;
            config[guildId].format = format;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return await interaction.reply(`✅ Auto nickname enabled with format: \`${format}\``);
        }
    }
};