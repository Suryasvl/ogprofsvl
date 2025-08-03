
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { moderationConfig } = require('../../moderation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Configure auto-moderation settings')
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('View current auto-moderation settings'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('toggle')
                .setDescription('Toggle auto-moderation features')
                .addStringOption(option =>
                    option.setName('feature')
                        .setDescription('Feature to toggle')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Anti-Link', value: 'antilink' },
                            { name: 'Bad Words Filter', value: 'badwords' }
                        ))
                .addBooleanOption(option =>
                    option.setName('enabled')
                        .setDescription('Enable or disable the feature')
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'status') {
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
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === 'toggle') {
            const feature = interaction.options.getString('feature');
            const enabled = interaction.options.getBoolean('enabled');

            switch (feature) {
                case 'antilink':
                    moderationConfig.antiLink.enabled = enabled;
                    await interaction.reply(`✅ Anti-link protection ${enabled ? 'enabled' : 'disabled'}`);
                    break;
                case 'badwords':
                    moderationConfig.badWords.enabled = enabled;
                    await interaction.reply(`✅ Bad words filter ${enabled ? 'enabled' : 'disabled'}`);
                    break;
            }
        }
    }
};
