const { SlashCommandBuilder } = require('discord.js');
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
    data: new SlashCommandBuilder()
        .setName('dnd')
        .setDescription('Set yourself to Do Not Disturb mode')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Duration (e.g., 1h, 30m, 120s)')
                .setRequired(true)),

    async execute(interaction) {
        const timeStr = interaction.options.getString('time');
        const timeMs = parseTime(timeStr);

        if (!timeMs) {
            return await interaction.reply('Invalid time format. Use: 1h (hours), 30m (minutes), 120s (seconds)');
        }

        const userId = interaction.user.id;
        const returnTime = Date.now() + timeMs;

        let dnd = {};
        const dndPath = path.join(__dirname, '../../dnd.json');
        if (fs.existsSync(dndPath)) {
            dnd = JSON.parse(fs.readFileSync(dndPath, 'utf8'));
        }

        dnd[userId] = returnTime;
        fs.writeFileSync(dndPath, JSON.stringify(dnd, null, 2));

        await interaction.reply(`🔕 You are now in DND mode for ${timeStr}. You'll be automatically taken out when time expires.`);
    }
};