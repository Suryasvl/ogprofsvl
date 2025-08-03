
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for muting')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply({ content: '❌ User not found in this server!', ephemeral: true });
        }

        if (member.isCommunicationDisabled()) {
            return await interaction.reply({ content: '❌ User is already muted!', ephemeral: true });
        }

        try {
            await member.timeout(10 * 60 * 1000, reason); // 10 minutes timeout
            
            const embed = new EmbedBuilder()
                .setColor(0x808080)
                .setTitle('🔇 Member Muted')
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Duration', value: '10 minutes', inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Failed to mute the user!', ephemeral: true });
        }
    }
};
