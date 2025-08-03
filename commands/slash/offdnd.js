const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('offdnd')
        .setDescription('Turn off Do Not Disturb mode'),

    async execute(interaction) {
        const userId = interaction.user.id;
        const dndPath = path.join(__dirname, '../../dnd.json');

        let dnd = {};
        if (fs.existsSync(dndPath)) {
            dnd = JSON.parse(fs.readFileSync(dndPath, 'utf8'));
        }

        if (!dnd[userId] || Date.now() >= dnd[userId]) {
            return await interaction.reply('❌ You are not currently in DND mode.');
        }

        delete dnd[userId];
        fs.writeFileSync(dndPath, JSON.stringify(dnd, null, 2));

        await interaction.reply('✅ DND mode has been turned off.');
    }
};