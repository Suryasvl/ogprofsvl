const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unsticky')
        .setDescription('Remove the sticky message from the current channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const channelId = interaction.channel.id;
        const stickyPath = path.join(__dirname, '../../sticky.json');

        let stickyData = {};
        if (fs.existsSync(stickyPath)) {
            stickyData = JSON.parse(fs.readFileSync(stickyPath, 'utf8'));
        }

        if (!stickyData[channelId] || !stickyData[channelId].active) {
            return await interaction.reply({ content: '❌ No active sticky message found in this channel.', ephemeral: true });
        }

        // Delete sticky message
        if (stickyData[channelId].messageId) {
            try {
                const stickyMessage = await interaction.channel.messages.fetch(stickyData[channelId].messageId);
                await stickyMessage.delete();
            } catch (error) {
                // Message might already be deleted
            }
        }

        delete stickyData[channelId];
        fs.writeFileSync(stickyPath, JSON.stringify(stickyData, null, 2));

        await interaction.reply({ content: '✅ Sticky message has been removed!', ephemeral: true });
    }
};