const fs = require('fs');
const path = require('path');

function parseTime(timeStr) {
    const match = timeStr.match(/^(\d+)([smhd]?)$/i);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2]?.toLowerCase() || 'm';

    const multipliers = {
        's': 1000,        // seconds
        'm': 60000,       // minutes
        'h': 3600000,     // hours
        'd': 86400000     // days
    };

    return value * multipliers[unit];
}

module.exports = {
    name: 'dnd',
    description: 'Set yourself to Do Not Disturb mode',
    usage: 'sdnd <time> - e.g., sdnd 1h, sdnd 30m, sdnd 120s',

    async execute(message, args) {
        if (!args[0]) {
            return message.reply('Please specify time. Examples: `sdnd 1h`, `sdnd 30m`, `sdnd 120s`');
        }

        const timeMs = parseTime(args[0]);
        if (!timeMs) {
            return message.reply('Invalid time format. Use: 1h (hours), 30m (minutes), 120s (seconds)');
        }

        const userId = message.author.id;
        const returnTime = Date.now() + timeMs;

        let dnd = {};
        const dndPath = path.join(__dirname, '../../dnd.json');
        if (fs.existsSync(dndPath)) {
            dnd = JSON.parse(fs.readFileSync(dndPath, 'utf8'));
        }

        dnd[userId] = returnTime;
        fs.writeFileSync(dndPath, JSON.stringify(dnd, null, 2));

        const timeText = args[0];
        await message.reply(`🔕 You are now in DND mode for ${timeText}. You'll be automatically taken out when time expires.`);
    }
};