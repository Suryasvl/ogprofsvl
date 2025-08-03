
# Discord All-Purpose Bot

A comprehensive Discord bot with both slash commands and prefix commands support.

## Features

- **Dual Command System**: Both slash commands (`/`) and prefix commands (`s`)
- **Moderation Tools**: kick, ban, clear messages, mute/unmute
- **Utility Commands**: ping, help, userinfo, serverinfo
- **Fun Commands**: avatar, say, roll dice
- **Error Handling**: Comprehensive error handling and logging
- **Easy to Extend**: Modular command structure for easy feature addition

## Setup Instructions

1. **Create a Discord Application**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and give it a name
   - Go to "Bot" section and click "Add Bot"
   - Copy the bot token

2. **Set up Environment Variables**:
   - Open the Secrets tab in Replit
   - Add a new secret with key `DISCORD_BOT_TOKEN` and your bot token as the value

3. **Bot Permissions**:
   - In Discord Developer Portal, go to OAuth2 > URL Generator
   - Select "bot" and "applications.commands" scopes
   - Select permissions: Send Messages, Use Slash Commands, Kick Members, Ban Members, Manage Messages, Manage Roles
   - Use the generated URL to invite the bot to your server

4. **Run the Bot**:
   - Click the Run button in Replit
   - The bot should come online in your Discord server

## Available Commands

### Utility Commands
- `s ping` or `/ping` - Check bot latency
- `s help` or `/help` - Show all commands
- `s userinfo [@user]` or `/userinfo [user]` - Get user information
- `s serverinfo` or `/serverinfo` - Get server information

### Moderation Commands (Requires Permissions)
- `s kick @user [reason]` or `/kick <user> [reason]` - Kick a user
- `s ban @user [reason]` or `/ban <user> [reason]` - Ban a user
- `s clear <amount>` or `/clear <amount>` - Clear messages (1-100)

### Fun Commands
- `s avatar [@user]` or `/avatar [user]` - Get user avatar
- `s say <message>` or `/say <message>` - Make bot say something
- `s roll [sides]` or `/roll [sides]` - Roll a dice

## Adding Custom Features

To add new commands, follow this structure in the `commandsData` object:

```javascript
commandName: {
    description: 'Command description',
    usage: `${PREFIX}commandname [arguments]`,
    permissions: ['RequiredPermission'], // Optional
    execute: async (interaction, args, isSlash = true) => {
        // Your command logic here
        // Use isSlash to differentiate between slash and prefix commands
        
        if (isSlash) {
            // Slash command response
            await interaction.reply('Response for slash command');
        } else {
            // Prefix command response
            await interaction.reply('Response for prefix command');
        }
    }
}
```

Don't forget to add the corresponding slash command to the `slashCommands` array if needed.

## Bot Configuration

- **Prefix**: `s` (can be changed in the code)
- **Color Theme**: Blue (`0x0099ff`)
- **Command Types**: Both slash and prefix supported

## Deployment

To keep your bot running 24/7:
1. Click the Deploy button in Replit
2. Choose "Reserved VM Deployment"
3. Follow the deployment instructions

## Support

The bot includes comprehensive error handling and logging. Check the console for any issues.
