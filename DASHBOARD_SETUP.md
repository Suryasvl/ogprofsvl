
# Discord Bot Dashboard Setup Guide

This guide will help you set up the web dashboard for your Discord moderation bot.

## Prerequisites

1. **Discord Application**: You need a Discord application with a bot token
2. **Node.js**: Ensure Node.js is installed (already available in Replit)
3. **Discord Developer Portal Access**: You'll need to configure OAuth2 settings

## Step 1: Discord Application Setup

### 1.1 Go to Discord Developer Portal
- Visit [Discord Developer Portal](https://discord.com/developers/applications)
- Select your bot application

### 1.2 Configure OAuth2 Settings
1. Go to "OAuth2" → "General"
2. Add these **Redirect URIs**:
   - `http://localhost:5000/auth/discord/callback` (for local development)
   - `https://your-repl-name.your-username.repl.co/auth/discord/callback` (for production)

### 1.3 Get Required Information
- **Application ID** (Client ID)
- **Client Secret** (from OAuth2 → General)
- **Bot Token** (from Bot section)

## Step 2: Environment Configuration

### 2.1 Set Environment Variables
Create a `.env` file or use Replit's Secrets tool:

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DASHBOARD_DOMAIN=https://your-repl-name.your-username.repl.co
```

### 2.2 Install Required Packages
```bash
npm install express express-session passport passport-discord ejs
```

## Step 3: Bot Invitation Link

### 3.1 Generate Invite Link
Replace `YOUR_CLIENT_ID` with your actual client ID:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

### 3.2 Required Permissions
The bot needs these permissions:
- ✅ **Administrator** (for full moderation access)
- ✅ **Manage Messages** (to delete inappropriate content)
- ✅ **Moderate Members** (to timeout users)
- ✅ **Manage Channels** (for lock/unlock commands)

## Step 4: Running the Dashboard

### 4.1 Start the Dashboard Server
```bash
cd dashboard
node server.js
```

### 4.2 Access the Dashboard
- Local: `http://localhost:5000`
- Replit: `https://your-repl-name.your-username.repl.co`

## Step 5: Using the Dashboard

### 5.1 Authentication
1. Click "Login with Discord"
2. Authorize the application
3. You'll be redirected to the dashboard

### 5.2 Server Management
1. Select a server from the dashboard
2. Configure bot settings:
   - **Prefix**: Change command prefix (default: "s")
   - **Auto-Moderation**: Toggle features on/off

### 5.3 Available Auto-Moderation Features
- **Anti-Link Protection**: Prevents unauthorized links
- **Bad Words Filter**: Filters inappropriate language
- **Anti-Spam**: Prevents message spam
- **Anti-Caps**: Prevents excessive capital letters

## Step 6: Moderation Features

### 6.1 Automatic Actions
The bot automatically:
- Deletes messages with links (except whitelisted domains)
- Warns users for inappropriate language
- Times out users for spam
- Deletes messages with excessive caps

### 6.2 Admin Bypass
Users with **Administrator** permission bypass all auto-moderation rules.

### 6.3 Logging
All moderation actions are logged to a channel named:
- `mod-log` or `logs` (the bot will find it automatically)

## Step 7: Commands Reference

### Moderation Commands (Slash & Prefix)
```
/kick @user [reason]     - Kick a user
/ban @user [reason]      - Ban a user
/mute @user [reason]     - Mute a user for 5 minutes
/warn @user [reason]     - Warn a user
/lock                    - Lock current channel
/unlock                  - Unlock current channel
/clear [amount]          - Clear messages
```

### Auto-Mod Commands
```
/automod status          - View current settings
/automod toggle [feature] [true/false] - Toggle features
```

## Step 8: Troubleshooting

### Common Issues

1. **"No servers found"**
   - Ensure you have Administrator permission in your Discord server
   - Make sure the bot is invited to your server

2. **Dashboard not loading**
   - Check if all environment variables are set correctly
   - Verify the redirect URI in Discord Developer Portal

3. **Bot not responding**
   - Ensure the bot token is correct
   - Check if the bot is online in your Discord server

4. **Permission errors**
   - Make sure the bot has the required permissions
   - Check if the bot's role is above other roles it needs to moderate

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure Discord OAuth2 settings are correct
4. Make sure the bot has proper permissions in your server

## Security Notes

- Never share your bot token or client secret
- Use environment variables for sensitive information
- The dashboard requires Administrator permission for security
- Auto-moderation can be bypassed by Administrators only

## Customization

You can customize:
- Bad words list in `moderation.js`
- Whitelisted domains for anti-link
- Punishment types (delete, warn, timeout)
- Dashboard styling in the EJS templates

The dashboard is now ready to use! Users with Administrator permission can access it to configure the bot's moderation settings easily.
