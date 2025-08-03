
# Discord All-Purpose Bot

A comprehensive Discord bot with moderation, utility, and fun commands.

## Features

- **Basic Commands**: ping, help, userinfo, serverinfo
- **Moderation**: kick, ban, clear messages
- **Slash Commands**: Modern Discord slash command support
- **Error Handling**: Comprehensive error handling and logging

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
   - Select permissions: Send Messages, Use Slash Commands, Kick Members, Ban Members, Manage Messages
   - Use the generated URL to invite the bot to your server

4. **Run the Bot**:
   - Click the Run button in Replit
   - The bot should come online in your Discord server

## Available Commands

- `/ping` - Check bot latency
- `/help` - Show all commands
- `/userinfo [user]` - Get user information
- `/serverinfo` - Get server information
- `/kick <user> [reason]` - Kick a user (requires permissions)
- `/ban <user> [reason]` - Ban a user (requires permissions)
- `/clear <amount>` - Clear messages (requires permissions)

## Adding More Features

You can easily extend this bot by:
1. Adding new slash commands to the `commands` array
2. Adding new cases to the switch statement in `interactionCreate`
3. Adding message-based commands in the `messageCreate` event

## Deployment

To keep your bot running 24/7, deploy it on Replit:
1. Click the Deploy button
2. Choose "Reserved VM Deployment"
3. Follow the deployment instructions
