
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Get a user\'s avatar',
    usage: 'savatar [@user]',
    
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`🖼️ ${user.tag}'s Avatar`)
            .setImage(user.displayAvatarURL({ size: 1024 }))
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};
