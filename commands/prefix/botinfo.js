// commands/prefix/botinfo.js
module.exports = {
  name: "botinfo",
  execute(message) {
    const uptime = process.uptime();
    message.channel.send(`🤖 **Bot Info**
- Uptime: ${Math.floor(uptime)} seconds
- Servers: ${message.client.guilds.cache.size}
- Users: ${message.client.users.cache.size}`);
  }
};