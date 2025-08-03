
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a member from the server',
    usage: 'sban @user [reason]',
    
    async execute(message, args) {
        if (!message.member.permissions.has('BanMembers')) {
            return await message.reply('❌ You need ban members permission!');
        }

        if (!args[0]) {
            return await message.reply('❌ Please mention a user to ban!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return await message.reply('❌ Please mention a valid user!');
        }

        const member = message.guild.members.cache.get(user.id);
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (member && !member.bannable) {
            return await message.reply('❌ I cannot ban this user!');
        }

        try {
            await message.guild.bans.create(user.id, { reason });
            
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('🔨 Member Banned')
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.reply('❌ Failed to ban the user!');
        }
    }
};
