const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'offdnd',
    description: 'Turn off Do Not Disturb mode',
    usage: 'soffdnd',

    async execute(message, args) {
        const userId = message.author.id;
        const dndPath = path.join(__dirname, '../../dnd.json');

        let dnd = {};
        if (fs.existsSync(dndPath)) {
            dnd = JSON.parse(fs.readFileSync(dndPath, 'utf8'));
        }

        if (!dnd[userId] || Date.now() >= dnd[userId]) {
            return message.reply('❌ You are not currently in DND mode.');
        }

        delete dnd[userId];
        fs.writeFileSync(dndPath, JSON.stringify(dnd, null, 2));

        await message.reply('✅ DND mode has been turned off.');
    }
};