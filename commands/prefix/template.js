
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'commandname',  // Change this to your command name
    description: 'Command description',  // Change this to your description
    usage: 'scommandname [arguments]',  // Change this to show usage
    
    async execute(message, args) {
        // Your command logic here
        // args[0] = first argument, args[1] = second argument, etc.
        
        // Example response:
        await message.reply('Your response here!');
        
        // Example with embed:
        // const embed = new EmbedBuilder()
        //     .setColor(0x0099ff)
        //     .setTitle('Title')
        //     .setDescription('Description')
        //     .setTimestamp();
        // 
        // await message.reply({ embeds: [embed] });
    }
};
