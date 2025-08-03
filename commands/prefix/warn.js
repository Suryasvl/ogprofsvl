
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'warn',
    description: 'Warn a member',
    usage: 'swarn @user [reason]',
    
    async execute(message, args) {
        if (!message.member.permissions.has('ModerateMembers')) {
            return await message.reply('❌ You need moderate members permission!');
        }

        if (!args[0]) {
            return await message.reply('❌ Please mention a user to warn!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return await message.reply('❌ Please mention a valid user!');
        }

        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (user.id === message.author.id) {
            return await message.reply('❌ You cannot warn yourself!');
        }

        if (user.bot) {
            return await message.reply('❌ You cannot warn bots!');
        }

        const embed = new EmbedBuilder()
            .setColor(0xffff00)
            .setTitle('⚠️ Member Warned')
            .addFields(
                { name: 'User', value: `${user.tag}`, inline: true },
                { name: 'Moderator', value: `${message.author.tag}`, inline: true },
                { name: 'Reason', value: reason, inline: false }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });

        // Try to DM the user
        try {
            await user.send(`⚠️ You have been warned in **${message.guild.name}**\n**Reason:** ${reason}`);
        } catch (error) {
            // User has DMs disabled, ignore
        }
    }
};
