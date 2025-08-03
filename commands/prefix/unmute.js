
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Unmute a member',
    usage: 'sunmute @user',
    
    async execute(message, args) {
        if (!message.member.permissions.has('ModerateMembers')) {
            return await message.reply('❌ You need moderate members permission!');
        }

        if (!args[0]) {
            return await message.reply('❌ Please mention a user to unmute!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return await message.reply('❌ Please mention a valid user!');
        }

        const member = message.guild.members.cache.get(user.id);

        if (!member) {
            return await message.reply('❌ User not found in this server!');
        }

        if (!member.isCommunicationDisabled()) {
            return await message.reply('❌ User is not muted!');
        }

        try {
            await member.timeout(null);
            
            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('🔊 Member Unmuted')
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${message.author.tag}`, inline: true }
                )
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.reply('❌ Failed to unmute the user!');
        }
    }
};
