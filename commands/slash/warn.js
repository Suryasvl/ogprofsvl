
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for warning')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (user.id === interaction.user.id) {
            return await interaction.reply({ content: '❌ You cannot warn yourself!', ephemeral: true });
        }

        if (user.bot) {
            return await interaction.reply({ content: '❌ You cannot warn bots!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xffff00)
            .setTitle('⚠️ Member Warned')
            .addFields(
                { name: 'User', value: `${user.tag}`, inline: true },
                { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                { name: 'Reason', value: reason, inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        // Try to DM the user
        try {
            await user.send(`⚠️ You have been warned in **${interaction.guild.name}**\n**Reason:** ${reason}`);
        } catch (error) {
            // User has DMs disabled, ignore
        }
    }
};
