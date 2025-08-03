const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'unsticky',
    description: 'Remove the sticky message from the current channel',
    usage: 'sunsticky',

    async execute(message, args) {
        if (!message.member.permissions.has('ManageMessages')) {
            return await message.reply('❌ You need Manage Messages permission to use this command!');
        }

        const channelId = message.channel.id;
        const stickyPath = path.join(__dirname, '../../sticky.json');

        let stickyData = {};
        if (fs.existsSync(stickyPath)) {
            stickyData = JSON.parse(fs.readFileSync(stickyPath, 'utf8'));
        }

        if (!stickyData[channelId] || !stickyData[channelId].active) {
            return message.reply('❌ No active sticky message found in this channel.');
        }

        // Delete sticky message
        if (stickyData[channelId].messageId) {
            try {
                const stickyMessage = await message.channel.messages.fetch(stickyData[channelId].messageId);
                await stickyMessage.delete();
            } catch (error) {
                // Message might already be deleted
            }
        }

        delete stickyData[channelId];
        fs.writeFileSync(stickyPath, JSON.stringify(stickyData, null, 2));

        await message.reply('✅ Sticky message has been removed!');
    }
};