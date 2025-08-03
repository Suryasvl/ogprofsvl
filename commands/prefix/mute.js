
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mute a member',
    usage: 'smute @user [reason]',
    
    async execute(message, args) {
        if (!message.member.permissions.has('ModerateMembers')) {
            return await message.reply('❌ You need moderate members permission!');
        }

        if (!args[0]) {
            return await message.reply('❌ Please mention a user to mute!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return await message.reply('❌ Please mention a valid user!');
        }

        const member = message.guild.members.cache.get(user.id);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!member) {
            return await message.reply('❌ User not found in this server!');
        }

        if (member.isCommunicationDisabled()) {
            return await message.reply('❌ User is already muted!');
        }

        try {
            await member.timeout(10 * 60 * 1000, reason); // 10 minutes timeout
            
            const embed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('🔇 Member Muted')
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                    { name: 'Duration', value: '10 minutes', inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.reply('❌ Failed to mute the user!');
        }
    }
};
