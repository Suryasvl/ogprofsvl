
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// Moderation configuration
const moderationConfig = {
    antiLink: {
        enabled: true,
        whitelist: ['discord.gg', 'replit.com'], // Whitelisted domains
        punishment: 'delete', // 'delete', 'warn', 'timeout'
    },
    badWords: {
        enabled: true,
        words: [
            'badword1', 'badword2', 'spam', 'toxic',
            // Add more bad words as needed
        ],
        punishment: 'warn', // 'delete', 'warn', 'timeout'
    },
    automod: {
        maxMentions: 5,
        maxEmojis: 10,
        capsPercentage: 80,
        spamThreshold: 5, // messages per 10 seconds
    }
};

// User spam tracking
const spamTracker = new Map();

// Check if user has admin permissions
function hasAdminPermission(member) {
    return member.permissions.has(PermissionFlagsBits.Administrator);
}

// Check for links in message
function containsLinks(content) {
    const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|\b[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\b)/gi;
    const links = content.match(linkRegex);
    
    if (!links) return false;
    
    // Check whitelist
    for (const link of links) {
        const isWhitelisted = moderationConfig.antiLink.whitelist.some(domain => 
            link.toLowerCase().includes(domain.toLowerCase())
        );
        if (!isWhitelisted) return true;
    }
    
    return false;
}

// Check for bad words
function containsBadWords(content) {
    const lowerContent = content.toLowerCase();
    return moderationConfig.badWords.words.some(word => 
        lowerContent.includes(word.toLowerCase())
    );
}

// Check for excessive caps
function hasExcessiveCaps(content) {
    if (content.length < 10) return false;
    const capsCount = (content.match(/[A-Z]/g) || []).length;
    const percentage = (capsCount / content.length) * 100;
    return percentage > moderationConfig.automod.capsPercentage;
}

// Check for spam
function isSpam(userId) {
    const now = Date.now();
    const userSpam = spamTracker.get(userId) || [];
    
    // Remove old entries (older than 10 seconds)
    const recentMessages = userSpam.filter(timestamp => now - timestamp < 10000);
    
    // Add current message
    recentMessages.push(now);
    spamTracker.set(userId, recentMessages);
    
    return recentMessages.length > moderationConfig.automod.spamThreshold;
}

// Log moderation action
async function logModerationAction(guild, action, user, moderator, reason, channel = null) {
    const logChannel = guild.channels.cache.find(ch => 
        ch.name.includes('mod-log') || ch.name.includes('logs')
    );
    
    if (!logChannel) return;
    
    const embed = new EmbedBuilder()
        .setColor(action === 'warn' ? 0xffff00 : 0xff0000)
        .setTitle(`🛡️ Moderation Action: ${action.toUpperCase()}`)
        .addFields(
            { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
            { name: 'Moderator', value: moderator.tag, inline: true },
            { name: 'Reason', value: reason, inline: false }
        )
        .setTimestamp();
    
    if (channel) {
        embed.addFields({ name: 'Channel', value: `#${channel.name}`, inline: true });
    }
    
    await logChannel.send({ embeds: [embed] });
}

// Apply punishment
async function applyPunishment(message, reason, punishment) {
    const { member, guild, channel } = message;
    
    try {
        switch (punishment) {
            case 'delete':
                await message.delete();
                await logModerationAction(guild, 'delete', message.author, guild.members.me.user, reason, channel);
                break;
                
            case 'warn':
                await message.delete();
                const warnEmbed = new EmbedBuilder()
                    .setColor(0xffff00)
                    .setTitle('⚠️ Warning')
                    .setDescription(`${member.user.tag}, ${reason}`)
                    .setTimestamp();
                
                const warningMsg = await channel.send({ embeds: [warnEmbed] });
                setTimeout(() => warningMsg.delete().catch(() => {}), 5000);
                
                await logModerationAction(guild, 'warn', message.author, guild.members.me.user, reason, channel);
                break;
                
            case 'timeout':
                await message.delete();
                await member.timeout(5 * 60 * 1000, reason); // 5 minutes timeout
                await logModerationAction(guild, 'timeout', message.author, guild.members.me.user, reason, channel);
                break;
        }
    } catch (error) {
        console.error('Error applying punishment:', error);
    }
}

// Main moderation check function
async function checkMessage(message) {
    // Skip if user has admin permissions
    if (hasAdminPermission(message.member)) return;
    
    const { content, member, guild } = message;
    
    // Anti-link check
    if (moderationConfig.antiLink.enabled && containsLinks(content)) {
        await applyPunishment(message, 'Links are not allowed in this server', moderationConfig.antiLink.punishment);
        return;
    }
    
    // Bad words check
    if (moderationConfig.badWords.enabled && containsBadWords(content)) {
        await applyPunishment(message, 'Inappropriate language is not allowed', moderationConfig.badWords.punishment);
        return;
    }
    
    // Excessive caps check
    if (hasExcessiveCaps(content)) {
        await applyPunishment(message, 'Please avoid excessive use of capital letters', 'delete');
        return;
    }
    
    // Spam check
    if (isSpam(message.author.id)) {
        await applyPunishment(message, 'Spam is not allowed', 'timeout');
        return;
    }
    
    // Excessive mentions check
    if (message.mentions.users.size > moderationConfig.automod.maxMentions) {
        await applyPunishment(message, 'Too many mentions in one message', 'delete');
        return;
    }
}

module.exports = {
    checkMessage,
    moderationConfig,
    hasAdminPermission,
    logModerationAction
};
