
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commandname')  // Change this to your command name
        .setDescription('Command description')  // Change this to your description
        // Add options if needed:
        // .addStringOption(option =>
        //     option.setName('input')
        //         .setDescription('Input description')
        //         .setRequired(true))
        ,
    
    async execute(interaction) {
        // Your command logic here
        
        // Example response:
        await interaction.reply('Your response here!');
        
        // Example with embed:
        // const embed = new EmbedBuilder()
        //     .setColor(0x0099ff)
        //     .setTitle('Title')
        //     .setDescription('Description')
        //     .setTimestamp();
        // 
        // await interaction.reply({ embeds: [embed] });
    }
};
