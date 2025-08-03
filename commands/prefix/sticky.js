const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'sticky',
    description: 'Create a sticky message in the current channel',
    usage: 'ssticky <message>',

    async execute(message, args) {
        if (!message.member.permissions.has('ManageMessages')) {
            return await message.reply('❌ You need Manage Messages permission to use this command!');
        }

        if (!args.length) {
            return message.reply('Please provide a message to make sticky. Usage: `ssticky <message>`');
        }

        const stickyMessage = args.join(' ');
        const channelId = message.channel.id;

        let stickyData = {};
        const stickyPath = path.join(__dirname, '../../sticky.json');
        if (fs.existsSync(stickyPath)) {
            stickyData = JSON.parse(fs.readFileSync(stickyPath, 'utf8'));
        }

        // Delete old sticky message if exists
        if (stickyData[channelId] && stickyData[channelId].messageId) {
            try {
                const oldMessage = await message.channel.messages.fetch(stickyData[channelId].messageId);
                await oldMessage.delete();
            } catch (error) {
                // Message might already be deleted
            }
        }

        // Send new sticky message
        const sentMessage = await message.channel.send(`📌 **STICKY:** ${stickyMessage}`);

        stickyData[channelId] = {
            messageId: sentMessage.id,
            content: stickyMessage,
            active: true
        };

        fs.writeFileSync(stickyPath, JSON.stringify(stickyData, null, 2));

        await message.reply('✅ Sticky message has been set!');

        // Delete the command message
        try {
            await message.delete();
        } catch (error) {
            // Ignore if can't delete
        }
    }
};