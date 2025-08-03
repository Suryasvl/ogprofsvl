
const { Client, GatewayIntentBits, Collection, SlashCommandBuilder, REST, Routes, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Bot configuration
const PREFIX = 's';
const BOT_COLOR = 0x0099ff;

// Collections to store commands
client.slashCommands = new Collection();
client.prefixCommands = new Collection();

// Command data structure for both slash and prefix
const commandsData = {
    ping: {
        description: 'Check bot latency',
        usage: `${PREFIX}ping`,
        execute: async (interaction, args, isSlash = true) => {
            const ping = Date.now() - (isSlash ? interaction.createdTimestamp : interaction.createdTimestamp);
            const apiPing = Math.round(client.ws.ping);
            
            const embed = new EmbedBuilder()
                .setColor(BOT_COLOR)
                .setTitle('🏓 Pong!')
                .addFields(
                    { name: 'Bot Latency', value: `${ping}ms`, inline: true },
                    { name: 'API Latency', value: `${apiPing}ms`, inline: true }
                )
                .setTimestamp();

            if (isSlash) {
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        }
    },
    
    help: {
        description: 'Show all available commands',
        usage: `${PREFIX}help`,
        execute: async (interaction, args, isSlash = true) => {
            const embed = new EmbedBuilder()
                .setColor(BOT_COLOR)
                .setTitle('🤖 Bot Commands')
                .setDescription(`**Prefix:** \`${PREFIX}\` | **Slash Commands:** Available`)
                .addFields(
                    { name: '📊 Utility Commands', value: '`ping` - Check bot latency\n`help` - Show this menu\n`userinfo` - Get user information\n`serverinfo` - Get server information', inline: false },
                    { name: '🔨 Moderation Commands', value: '`kick` - Kick a user\n`ban` - Ban a user\n`unban` - Unban a user\n`clear` - Clear messages\n`mute` - Mute a user\n`unmute` - Unmute a user', inline: false },
                    { name: '🎉 Fun Commands', value: '`avatar` - Get user avatar\n`say` - Make bot say something\n`roll` - Roll a dice', inline: false }
                )
                .setFooter({ text: `Use ${PREFIX}<command> or /<command>` })
                .setTimestamp();

            if (isSlash) {
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        }
    },
    
    userinfo: {
        description: 'Get information about a user',
        usage: `${PREFIX}userinfo [@user]`,
        execute: async (interaction, args, isSlash = true) => {
            let user, member;
            
            if (isSlash) {
                user = interaction.options.getUser('user') || interaction.user;
                member = await interaction.guild.members.fetch(user.id);
            } else {
                const mention = interaction.mentions.users.first();
                user = mention || interaction.author;
                member = await interaction.guild.members.fetch(user.id);
            }
            
            const embed = new EmbedBuilder()
                .setColor(BOT_COLOR)
                .setTitle(`${user.username}'s Information`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Username', value: user.username, inline: true },
                    { name: 'Discriminator', value: `#${user.discriminator}`, inline: true },
                    { name: 'ID', value: user.id, inline: true },
                    { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true },
                    { name: 'Account Created', value: user.createdAt.toDateString(), inline: true },
                    { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', ') || 'None', inline: false }
                )
                .setTimestamp();

            if (isSlash) {
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        }
    },
    
    serverinfo: {
        description: 'Get server information',
        usage: `${PREFIX}serverinfo`,
        execute: async (interaction, args, isSlash = true) => {
            const guild = interaction.guild;
            const embed = new EmbedBuilder()
                .setColor(BOT_COLOR)
                .setTitle(`${guild.name} Server Information`)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields(
                    { name: 'Server Name', value: guild.name, inline: true },
                    { name: 'Server ID', value: guild.id, inline: true },
                    { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: 'Member Count', value: guild.memberCount.toString(), inline: true },
                    { name: 'Created', value: guild.createdAt.toDateString(), inline: true },
                    { name: 'Boost Level', value: guild.premiumTier.toString(), inline: true }
                )
                .setTimestamp();

            if (isSlash) {
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        }
    },
    
    kick: {
        description: 'Kick a user from the server',
        usage: `${PREFIX}kick @user [reason]`,
        permissions: ['KickMembers'],
        execute: async (interaction, args, isSlash = true) => {
            let user, reason;
            
            const hasPermission = isSlash ? 
                interaction.member.permissions.has(PermissionFlagsBits.KickMembers) :
                interaction.member.permissions.has(PermissionFlagsBits.KickMembers);
                
            if (!hasPermission) {
                const errorMsg = 'You do not have permission to kick members!';
                if (isSlash) {
                    return await interaction.reply({ content: errorMsg, ephemeral: true });
                } else {
                    return await interaction.reply(errorMsg);
                }
            }
            
            if (isSlash) {
                user = interaction.options.getUser('user');
                reason = interaction.options.getString('reason') || 'No reason provided';
            } else {
                user = interaction.mentions.users.first();
                reason = args.slice(1).join(' ') || 'No reason provided';
                
                if (!user) {
                    return await interaction.reply('Please mention a user to kick!');
                }
            }
            
            const member = await interaction.guild.members.fetch(user.id);
            
            if (!member.kickable) {
                const errorMsg = 'I cannot kick this user!';
                if (isSlash) {
                    return await interaction.reply({ content: errorMsg, ephemeral: true });
                } else {
                    return await interaction.reply(errorMsg);
                }
            }
            
            await member.kick(reason);
            const successMsg = `${user.username} has been kicked. Reason: ${reason}`;
            
            if (isSlash) {
                await interaction.reply(successMsg);
            } else {
                await interaction.reply(successMsg);
            }
        }
    },
    
    ban: {
        description: 'Ban a user from the server',
        usage: `${PREFIX}ban @user [reason]`,
        permissions: ['BanMembers'],
        execute: async (interaction, args, isSlash = true) => {
            let user, reason;
            
            const hasPermission = isSlash ? 
                interaction.member.permissions.has(PermissionFlagsBits.BanMembers) :
                interaction.member.permissions.has(PermissionFlagsBits.BanMembers);
                
            if (!hasPermission) {
                const errorMsg = 'You do not have permission to ban members!';
                if (isSlash) {
                    return await interaction.reply({ content: errorMsg, ephemeral: true });
                } else {
                    return await interaction.reply(errorMsg);
                }
            }
            
            if (isSlash) {
                user = interaction.options.getUser('user');
                reason = interaction.options.getString('reason') || 'No reason provided';
            } else {
                user = interaction.mentions.users.first();
                reason = args.slice(1).join(' ') || 'No reason provided';
                
                if (!user) {
                    return await interaction.reply('Please mention a user to ban!');
                }
            }
            
            const member = await interaction.guild.members.fetch(user.id);
            
            if (!member.bannable) {
                const errorMsg = 'I cannot ban this user!';
                if (isSlash) {
                    return await interaction.reply({ content: errorMsg, ephemeral: true });
                } else {
                    return await interaction.reply(errorMsg);
                }
            }
            
            await member.ban({ reason: reason });
            const successMsg = `${user.username} has been banned. Reason: ${reason}`;
            
            if (isSlash) {
                await interaction.reply(successMsg);
            } else {
                await interaction.reply(successMsg);
            }
        }
    },
    
    clear: {
        description: 'Clear messages from a channel',
        usage: `${PREFIX}clear <amount>`,
        permissions: ['ManageMessages'],
        execute: async (interaction, args, isSlash = true) => {
            const hasPermission = isSlash ? 
                interaction.member.permissions.has(PermissionFlagsBits.ManageMessages) :
                interaction.member.permissions.has(PermissionFlagsBits.ManageMessages);
                
            if (!hasPermission) {
                const errorMsg = 'You do not have permission to manage messages!';
                if (isSlash) {
                    return await interaction.reply({ content: errorMsg, ephemeral: true });
                } else {
                    return await interaction.reply(errorMsg);
                }
            }
            
            let amount;
            
            if (isSlash) {
                amount = interaction.options.getInteger('amount');
            } else {
                amount = parseInt(args[0]);
                
                if (!amount) {
                    return await interaction.reply('Please provide a valid number!');
                }
            }
            
            if (amount < 1 || amount > 100) {
                const errorMsg = 'Please provide a number between 1 and 100!';
                if (isSlash) {
                    return await interaction.reply({ content: errorMsg, ephemeral: true });
                } else {
                    return await interaction.reply(errorMsg);
                }
            }
            
            await interaction.channel.bulkDelete(amount, true);
            const successMsg = `Deleted ${amount} messages!`;
            
            if (isSlash) {
                await interaction.reply({ content: successMsg, ephemeral: true });
            } else {
                const reply = await interaction.reply(successMsg);
                setTimeout(() => reply.delete().catch(() => {}), 5000);
            }
        }
    },
    
    avatar: {
        description: 'Get user avatar',
        usage: `${PREFIX}avatar [@user]`,
        execute: async (interaction, args, isSlash = true) => {
            let user;
            
            if (isSlash) {
                user = interaction.options.getUser('user') || interaction.user;
            } else {
                user = interaction.mentions.users.first() || interaction.author;
            }
            
            const embed = new EmbedBuilder()
                .setColor(BOT_COLOR)
                .setTitle(`${user.username}'s Avatar`)
                .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setTimestamp();

            if (isSlash) {
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        }
    },
    
    say: {
        description: 'Make the bot say something',
        usage: `${PREFIX}say <message>`,
        execute: async (interaction, args, isSlash = true) => {
            let message;
            
            if (isSlash) {
                message = interaction.options.getString('message');
            } else {
                message = args.join(' ');
                
                if (!message) {
                    return await interaction.reply('Please provide a message!');
                }
                
                // Delete the original command message for prefix commands
                interaction.delete().catch(() => {});
            }
            
            if (isSlash) {
                await interaction.reply({ content: message, ephemeral: true });
                await interaction.followUp(message);
            } else {
                await interaction.channel.send(message);
            }
        }
    },
    
    roll: {
        description: 'Roll a dice',
        usage: `${PREFIX}roll [sides]`,
        execute: async (interaction, args, isSlash = true) => {
            let sides;
            
            if (isSlash) {
                sides = interaction.options.getInteger('sides') || 6;
            } else {
                sides = parseInt(args[0]) || 6;
            }
            
            if (sides < 2) {
                const errorMsg = 'Dice must have at least 2 sides!';
                if (isSlash) {
                    return await interaction.reply({ content: errorMsg, ephemeral: true });
                } else {
                    return await interaction.reply(errorMsg);
                }
            }
            
            const result = Math.floor(Math.random() * sides) + 1;
            const embed = new EmbedBuilder()
                .setColor(BOT_COLOR)
                .setTitle('🎲 Dice Roll')
                .setDescription(`You rolled a **${result}** out of ${sides}!`)
                .setTimestamp();

            if (isSlash) {
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        }
    }
};

// Build slash commands array
const slashCommands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency'),
    
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands'),
    
    new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get info about')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get server information'),
    
    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kick')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for ban')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages from a channel')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get user avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to get avatar of')
                .setRequired(false)),
    
    new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message to say')
                .setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a dice')
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('Number of sides on the dice')
                .setRequired(false))
];

// Store commands in collections
Object.keys(commandsData).forEach(commandName => {
    client.slashCommands.set(commandName, commandsData[commandName]);
    client.prefixCommands.set(commandName, commandsData[commandName]);
});

// When the client is ready
client.once('ready', async () => {
    console.log(`🤖 Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guilds with ${client.users.cache.size} users`);
    console.log(`🔧 Prefix: ${PREFIX} | Slash Commands: Enabled`);
    
    // Set bot status
    client.user.setActivity(`${PREFIX}help | /help`, { type: 'LISTENING' });
    
    // Register slash commands
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
    
    try {
        console.log('🔄 Started refreshing application (/) commands.');
        
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: slashCommands },
        );
        
        console.log('✅ Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('❌ Error registering slash commands:', error);
    }
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    
    if (!command) {
        return await interaction.reply({ content: 'Unknown command!', ephemeral: true });
    }

    try {
        await command.execute(interaction, [], true);
    } catch (error) {
        console.error('❌ Error executing slash command:', error);
        const errorMsg = 'There was an error executing this command!';
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMsg, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMsg, ephemeral: true });
        }
    }
});

// Handle prefix commands
client.on('messageCreate', async message => {
    // Ignore bots and messages without prefix
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;
    
    // Parse command and arguments
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.prefixCommands.get(commandName);
    
    if (!command) return;
    
    try {
        await command.execute(message, args, false);
    } catch (error) {
        console.error('❌ Error executing prefix command:', error);
        message.reply('There was an error executing this command!');
    }
});

// Error handling
client.on('error', error => {
    console.error('❌ Client error:', error);
});

client.on('warn', warning => {
    console.warn('⚠️ Client warning:', warning);
});

process.on('unhandledRejection', error => {
    console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('❌ Uncaught exception:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🔄 Received SIGINT, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🔄 Received SIGTERM, shutting down gracefully...');
    client.destroy();
    process.exit(0);
});

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN);
