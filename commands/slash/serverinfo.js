
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get information about the server'),
    
    async execute(interaction) {
        const guild = interaction.guild;
        
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`📊 ${guild.name} Server Info`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: '🆔 Server ID', value: guild.id, inline: true },
                { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: '🌍 Region', value: 'Auto', inline: true },
                { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
                { name: '💬 Channels', value: `${guild.channels.cache.size}`, inline: true },
                { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
                { name: '🛡️ Verification Level', value: guild.verificationLevel.toString(), inline: true },
                { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
