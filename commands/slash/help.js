
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('🤖 Bot Commands')
            .setDescription('**Prefix:** `s` | **Slash Commands:** Available')
            .addFields(
                { name: '📊 Utility Commands', value: '`ping` - Check bot latency\n`help` - Show this menu\n`userinfo` - Get user information\n`serverinfo` - Get server information', inline: false },
                { name: '🔨 Moderation Commands', value: '`kick` - Kick a user\n`ban` - Ban a user\n`clear` - Clear messages\n`mute` - Mute a user\n`unmute` - Unmute a user', inline: false },
                { name: '🎉 Fun Commands', value: '`avatar` - Get user avatar\n`say` - Make bot say something\n`roll` - Roll a dice', inline: false }
            )
            .setFooter({ text: 'Use s<command> or /<command>' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
