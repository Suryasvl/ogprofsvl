
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to unmute')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply({ content: '❌ User not found in this server!', ephemeral: true });
        }

        if (!member.isCommunicationDisabled()) {
            return await interaction.reply({ content: '❌ User is not muted!', ephemeral: true });
        }

        try {
            await member.timeout(null);
            
            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('🔊 Member Unmuted')
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Moderator', value: `${interaction.user.tag}`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Failed to unmute the user!', ephemeral: true });
        }
    }
};
