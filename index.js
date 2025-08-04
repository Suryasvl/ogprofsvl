require('./keepalive');
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { checkMessage } = require('./moderation');

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
let PREFIX = 's';
let guildPrefixes = {};

// Load guild-specific prefixes
function loadPrefixes() {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.guilds) {
            guildPrefixes = config.guilds;
        }
    }
}

// Get prefix for a specific guild
function getPrefix(guildId) {
    return guildPrefixes[guildId]?.prefix || PREFIX;
}

loadPrefixes();

// Collections to store commands
client.slashCommands = new Collection();
client.prefixCommands = new Collection();

// Load slash commands
const slashCommandsPath = path.join(__dirname, 'commands', 'slash');
const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));

for (const file of slashCommandFiles) {
    const filePath = path.join(slashCommandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.slashCommands.set(command.data.name, command);
        console.log(`✅ Loaded slash command: ${command.data.name}`);
    } else {
        console.log(`⚠️ The slash command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Load prefix commands
const prefixCommandsPath = path.join(__dirname, 'commands', 'prefix');
const prefixCommandFiles = fs.readdirSync(prefixCommandsPath).filter(file => file.endsWith('.js'));

for (const file of prefixCommandFiles) {
    const filePath = path.join(prefixCommandsPath, file);
    const command = require(filePath);

    if ('name' in command && 'execute' in command) {
        client.prefixCommands.set(command.name, command);
        console.log(`✅ Loaded prefix command: ${command.name}`);
    } else {
        console.log(`⚠️ The prefix command at ${filePath} is missing a required "name" or "execute" property.`);
    }
}

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

        const commands = [];
        client.slashCommands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
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
        await command.execute(interaction);
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
    // Ignore bots
    if (message.author.bot) return;

    // Skip DMs
    if (!message.guild) return;

    // Run moderation checks first
    await checkMessage(message);
    // ✅ DND Mention Check
    try {
        const dndPath = path.join(__dirname, 'dnd.json');
        if (fs.existsSync(dndPath)) {
            const dndData = JSON.parse(fs.readFileSync(dndPath, 'utf8'));

            message.mentions.users.forEach((user) => {
                const endTime = dndData[user.id];
                if (endTime && Date.now() < endTime) {
                    const remaining = Math.ceil((endTime - Date.now()) / 60000);
                    const timeLeft = remaining > 60 ? 
                        `${Math.ceil(remaining / 60)} hour(s)` : 
                        `${remaining} minute(s)`;
                    message.reply(`🔕 <@${user.id}> is in DND mode. Please wait ${timeLeft} before messaging them again.`);
                }
            });
        }
    } catch (err) {
        console.error('DND check failed:', err);
    }

    // ✅ Sticky Message Handler
    try {
        const stickyPath = path.join(__dirname, 'sticky.json');
        if (fs.existsSync(stickyPath)) {
            const stickyData = JSON.parse(fs.readFileSync(stickyPath, 'utf8'));
            const channelSticky = stickyData[message.channel.id];

            if (channelSticky && channelSticky.active) {
                // Delete old sticky message
                if (channelSticky.messageId) {
                    try {
                        const oldStickyMessage = await message.channel.messages.fetch(channelSticky.messageId);
                        await oldStickyMessage.delete();
                    } catch (error) {
                        // Old message might already be deleted
                    }
                }

                // Post new sticky message after a short delay
                setTimeout(async () => {
                    try {
                        const newStickyMessage = await message.channel.send(`📌 **STICKY:** ${channelSticky.content}`);
                        stickyData[message.channel.id].messageId = newStickyMessage.id;
                        fs.writeFileSync(stickyPath, JSON.stringify(stickyData, null, 2));
                    } catch (error) {
                        console.error('Failed to send sticky message:', error);
                    }
                }, 2000);
            }
        }
    } catch (err) {
        console.error('Sticky message handler failed:', err);
    }

    // Get guild-specific prefix
    const guildPrefix = getPrefix(message.guild?.id);

    // Check if message starts with prefix
    if (!message.content.startsWith(guildPrefix)) return;

    // Parse command and arguments
    const args = message.content.slice(guildPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);

    if (!command) return;

    try {
        await command.execute(message, args);
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
// Auto Nickname on Member Join
client.on('guildMemberAdd', async (member) => {
    const filePath = path.join(__dirname, 'autonick.json');

    if (!fs.existsSync(filePath)) return;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!data.format) return;

    const newNick = data.format.replace('{username}', member.user.username);

    try {
        await member.setNickname(newNick);
        console.log(`✅ Nickname set for ${member.user.username}`);
    } catch (err) {
        console.log(`❌ Failed to set nickname: ${err.message}`);
    }
});

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN);