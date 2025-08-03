
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a member from the server',
    usage: 'skick @user [reason]',
    
    async execute(message, args) {
        if (!message.member.permissions.has('KickMembers')) {
            return await message.reply('❌ You need kick members permission!');
        }

        if (!args[0]) {
            return await message.reply('❌ Please mention a user to kick!');
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

        if (!member.kickable) {
            return await message.reply('❌ I cannot kick this user!');
        }

        try {
            await member.kick(reason);
            
            const embed = new EmbedBuilder()
                .setColor(0xff9900)
                .setTitle('👢 Member Kicked')
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await message.reply('❌ Failed to kick the user!');
        }
    }
};
