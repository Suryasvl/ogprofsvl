
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Get information about a user',
    usage: 'suserinfo [@user]',
    
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);
        
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`👤 ${user.tag} User Info`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: '🆔 User ID', value: user.id, inline: true },
                { name: '🤖 Bot', value: user.bot ? 'Yes' : 'No', inline: true },
                { name: '📅 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false }
            );

        if (member) {
            embed.addFields(
                { name: '📅 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
                { name: '🎭 Roles', value: member.roles.cache.filter(role => role.name !== '@everyone').map(role => `<@&${role.id}>`).join(', ') || 'None', inline: false }
            );
        }

        embed.setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};
