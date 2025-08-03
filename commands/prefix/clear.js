module.exports = {
  name: 'clear',
  execute: async (message, args) => {
    if (!args[0] || isNaN(args[0])) return message.reply('Please provide a valid number of messages to delete.');

    const amount = parseInt(args[0]);
    if (amount > 100 || amount < 1) return message.reply('You can delete between 1 and 100 messages.');

    await message.channel.bulkDelete(amount, true);
    message.channel.send(`🧹 Deleted ${amount} messages`).then(msg => setTimeout(() => msg.delete(), 3000));
  }
};