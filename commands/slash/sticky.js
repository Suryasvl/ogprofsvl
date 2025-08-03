const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sticky')
        .setDescription('Create a sticky message in the current channel')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to make sticky')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const stickyMessage = interaction.options.getString('message');
        const channelId = interaction.channel.id;

        let stickyData = {};
        const stickyPath = path.join(__dirname, '../../sticky.json');
        if (fs.existsSync(stickyPath)) {
            stickyData = JSON.parse(fs.readFileSync(stickyPath, 'utf8'));
        }

        // Delete old sticky message if exists
        if (stickyData[channelId] && stickyData[channelId].messageId) {
            try {
                const oldMessage = await interaction.channel.messages.fetch(stickyData[channelId].messageId);
                await oldMessage.delete();
            } catch (error) {
                // Message might already be deleted
            }
        }

        // Send new sticky message
        const sentMessage = await interaction.channel.send(`📌 **STICKY:** ${stickyMessage}`);

        stickyData[channelId] = {
            messageId: sentMessage.id,
            content: stickyMessage,
            active: true
        };

        fs.writeFileSync(stickyPath, JSON.stringify(stickyData, null, 2));

        await interaction.reply({ content: '✅ Sticky message has been set!', ephemeral: true });
    }
};