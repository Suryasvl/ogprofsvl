
const { Client, GatewayIntentBits, Collection, SlashCommandBuilder, REST, Routes } = require('discord.js');

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

// Collection to store commands
client.commands = new Collection();

// Basic slash commands
const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows available commands'),
    
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
                .setRequired(true))
];

// When the client is ready, run this code
client.once('ready', async () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    
    // Register slash commands
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
    
    try {
        console.log('Started refreshing application (/) commands.');
        
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    try {
        switch (commandName) {
            case 'ping':
                await interaction.reply('Pong!');
                break;
                
            case 'help':
                const helpEmbed = {
                    color: 0x0099ff,
                    title: 'Bot Commands',
                    description: 'Here are all available commands:',
                    fields: [
                        { name: '/ping', value: 'Check bot latency', inline: true },
                        { name: '/help', value: 'Show this help message', inline: true },
                        { name: '/userinfo', value: 'Get user information', inline: true },
                        { name: '/serverinfo', value: 'Get server information', inline: true },
                        { name: '/kick', value: 'Kick a user (Requires permissions)', inline: true },
                        { name: '/ban', value: 'Ban a user (Requires permissions)', inline: true },
                        { name: '/clear', value: 'Clear messages (Requires permissions)', inline: true }
                    ],
                    timestamp: new Date().toISOString(),
                };
                await interaction.reply({ embeds: [helpEmbed] });
                break;
                
            case 'userinfo':
                const user = interaction.options.getUser('user') || interaction.user;
                const member = await interaction.guild.members.fetch(user.id);
                
                const userEmbed = {
                    color: 0x0099ff,
                    title: `${user.username}'s Information`,
                    thumbnail: { url: user.displayAvatarURL() },
                    fields: [
                        { name: 'Username', value: user.username, inline: true },
                        { name: 'ID', value: user.id, inline: true },
                        { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true },
                        { name: 'Account Created', value: user.createdAt.toDateString(), inline: true },
                        { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', ') || 'None', inline: false }
                    ],
                    timestamp: new Date().toISOString(),
                };
                await interaction.reply({ embeds: [userEmbed] });
                break;
                
            case 'serverinfo':
                const guild = interaction.guild;
                const serverEmbed = {
                    color: 0x0099ff,
                    title: `${guild.name} Server Information`,
                    thumbnail: { url: guild.iconURL() },
                    fields: [
                        { name: 'Server Name', value: guild.name, inline: true },
                        { name: 'Server ID', value: guild.id, inline: true },
                        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                        { name: 'Member Count', value: guild.memberCount.toString(), inline: true },
                        { name: 'Created', value: guild.createdAt.toDateString(), inline: true },
                        { name: 'Boost Level', value: guild.premiumTier.toString(), inline: true }
                    ],
                    timestamp: new Date().toISOString(),
                };
                await interaction.reply({ embeds: [serverEmbed] });
                break;
                
            case 'kick':
                if (!interaction.member.permissions.has('KICK_MEMBERS')) {
                    return await interaction.reply({ content: 'You do not have permission to kick members!', ephemeral: true });
                }
                
                const kickUser = interaction.options.getUser('user');
                const kickReason = interaction.options.getString('reason') || 'No reason provided';
                const kickMember = await interaction.guild.members.fetch(kickUser.id);
                
                if (!kickMember.kickable) {
                    return await interaction.reply({ content: 'I cannot kick this user!', ephemeral: true });
                }
                
                await kickMember.kick(kickReason);
                await interaction.reply(`${kickUser.username} has been kicked. Reason: ${kickReason}`);
                break;
                
            case 'ban':
                if (!interaction.member.permissions.has('BAN_MEMBERS')) {
                    return await interaction.reply({ content: 'You do not have permission to ban members!', ephemeral: true });
                }
                
                const banUser = interaction.options.getUser('user');
                const banReason = interaction.options.getString('reason') || 'No reason provided';
                const banMember = await interaction.guild.members.fetch(banUser.id);
                
                if (!banMember.bannable) {
                    return await interaction.reply({ content: 'I cannot ban this user!', ephemeral: true });
                }
                
                await banMember.ban({ reason: banReason });
                await interaction.reply(`${banUser.username} has been banned. Reason: ${banReason}`);
                break;
                
            case 'clear':
                if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
                    return await interaction.reply({ content: 'You do not have permission to manage messages!', ephemeral: true });
                }
                
                const amount = interaction.options.getInteger('amount');
                
                if (amount < 1 || amount > 100) {
                    return await interaction.reply({ content: 'Please provide a number between 1 and 100!', ephemeral: true });
                }
                
                await interaction.channel.bulkDelete(amount, true);
                await interaction.reply({ content: `Deleted ${amount} messages!`, ephemeral: true });
                break;
                
            default:
                await interaction.reply('Unknown command!');
        }
    } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

// Handle regular messages (for future message commands)
client.on('messageCreate', message => {
    if (message.author.bot) return;
    
    // Add your message-based commands here
    // Example: if (message.content === '!hello') { message.reply('Hello!'); }
});

// Error handling
client.on('error', error => {
    console.error('Client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN);
