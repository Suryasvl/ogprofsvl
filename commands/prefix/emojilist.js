// commands/prefix/emojilist.js
module.exports = {
  name: "emojilist",
  execute(message) {
    const emojis = message.guild.emojis.cache.map(e => e.toString()).join(' ');
    message.channel.send(`😀 Emojis:\n${emojis || 'No emojis in this server.'}`);
  }
};