
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Check bot latency',
    usage: 'sping',
    
    async execute(message, args) {
        const ping = Date.now() - message.createdTimestamp;
        const apiPing = Math.round(message.client.ws.ping);
        
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Bot Latency', value: `${ping}ms`, inline: true },
                { name: 'API Latency', value: `${apiPing}ms`, inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
};
