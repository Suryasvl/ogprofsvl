const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Configure welcome messages for new members')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('on')
                .setDescription('Enable welcome messages')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel to send welcome messages')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('off')
                .setDescription('Disable welcome messages'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Configure welcome message')
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('Welcome message title')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Welcome message description (use {user}, {username}, {server})')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('Embed color (hex code like #ff0000)')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('test')
                .setDescription('Test current welcome message setup'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check current welcome settings')),

    async execute(interaction) {
        const configPath = path.join(__dirname, '../../welcome.json');
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        const guildId = interaction.guild.id;
        if (!config[guildId]) config[guildId] = { enabled: false, channelId: null, title: null, description: null, color: null };

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'status') {
            const status = config[guildId].enabled ? 'ON' : 'OFF';
            const channel = config[guildId].channelId ? `<#${config[guildId].channelId}>` : 'Not set';
            const title = config[guildId].title || 'Default';
            const description = config[guildId].description || 'Default';
            return await interaction.reply(`🎉 **Welcome Status:** ${status}\n📢 **Channel:** ${channel}\n📝 **Title:** ${title}\n📄 **Description:** ${description}`);
        }

        if (subcommand === 'off') {
            config[guildId].enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return await interaction.reply('✅ Welcome messages have been disabled.');
        }

        if (subcommand === 'on') {
            const channel = interaction.options.getChannel('channel');
            config[guildId].enabled = true;
            config[guildId].channelId = channel.id;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return await interaction.reply(`✅ Welcome messages enabled in ${channel}.`);
        }

        if (subcommand === 'set') {
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const color = interaction.options.getString('color');

            if (title) config[guildId].title = title;
            if (description) config[guildId].description = description;
            if (color) config[guildId].color = color;

            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            return await interaction.reply('✅ Welcome message configuration updated!');
        }

        if (subcommand === 'test') {
            if (!config[guildId].enabled) {
                return await interaction.reply('❌ Welcome messages are disabled. Enable them first.');
            }

            const channel = interaction.guild.channels.cache.get(config[guildId].channelId);
            if (!channel) {
                return await interaction.reply('❌ Welcome channel not found.');
            }

            const embed = new EmbedBuilder()
                .setTitle(config[guildId].title || '🎉 Welcome!')
                .setDescription((config[guildId].description || 'Welcome {user} to **{server}**! 🌟').replace('{user}', interaction.user).replace('{username}', interaction.user.username).replace('{server}', interaction.guild.name))
                .setColor(config[guildId].color || '#00ff00')
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: `Member #${interaction.guild.memberCount}` })
                .setTimestamp();

            await channel.send({ embeds: [embed] });
            return await interaction.reply({ content: '✅ Test welcome message sent!', ephemeral: true });
        }
    }
};