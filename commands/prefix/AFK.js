const afkMap = new Map();

module.exports = {
  name: 'afk',
  execute: (message, args) => {
    const reason = args.join(' ') || 'AFK';
    afkMap.set(message.author.id, reason);
    message.reply(`You are now AFK: **${reason}**`);
  }
};