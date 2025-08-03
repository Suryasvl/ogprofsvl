
const { EmbedBuilder } = require('discord.js');
const { moderationConfig } = require('../../moderation');

module.exports = {
    name: 'automod',
    description: 'Configure auto-moderation settings',
    usage: 'sautomod [enable/disable] [feature]',
    
    async execute(message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return await message.reply('❌ You need administrator permission to use this command!');
        }

        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('🛡️ Auto-Moderation Settings')
                .addFields(
                    { name: 'Anti-Link', value: moderationConfig.antiLink.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
                    { name: 'Bad Words Filter', value: moderationConfig.badWords.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
                    { name: 'Max Mentions', value: `${moderationConfig.automod.maxMentions}`, inline: true },
                    { name: 'Caps Threshold', value: `${moderationConfig.automod.capsPercentage}%`, inline: true },
                    { name: 'Spam Threshold', value: `${moderationConfig.automod.spamThreshold} msgs/10s`, inline: true }
                )
                .setFooter({ text: 'Use sautomod enable/disable [feature] to toggle features' })
                .setTimestamp();

            return await message.reply({ embeds: [embed] });
        }

        const action = args[0].toLowerCase();
        const feature = args[1]?.toLowerCase();

        if (!['enable', 'disable'].includes(action)) {
            return await message.reply('❌ Please use `enable` or `disable`');
        }

        const isEnabled = action === 'enable';

        switch (feature) {
            case 'antilink':
            case 'links':
                moderationConfig.antiLink.enabled = isEnabled;
                await message.reply(`✅ Anti-link protection ${isEnabled ? 'enabled' : 'disabled'}`);
                break;
            case 'badwords':
            case 'filter':
                moderationConfig.badWords.enabled = isEnabled;
                await message.reply(`✅ Bad words filter ${isEnabled ? 'enabled' : 'disabled'}`);
                break;
            default:
                await message.reply('❌ Available features: `antilink`, `badwords`');
        }
    }
};
