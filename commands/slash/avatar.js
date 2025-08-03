
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get a user\'s avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get avatar of')
                .setRequired(false)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`🖼️ ${user.tag}'s Avatar`)
            .setImage(user.displayAvatarURL({ size: 1024 }))
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
