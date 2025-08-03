module.exports = {
  name: 'poll',
  execute: async (message, args) => {
    const question = args.join(' ');
    if (!question) return message.channel.send('❗ Provide a poll question.');
    const msg = await message.channel.send(`📊 **Poll:** ${question}`);
    await msg.react('👍');
    await msg.react('👎');
  }
};