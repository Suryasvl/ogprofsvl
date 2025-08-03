module.exports = {
  name: 'slowmode',
  execute: async (message, args) => {
    if (!message.member.permissions.has('ManageChannels')) return;
    const seconds = parseInt(args[0]);
    if (isNaN(seconds)) return message.channel.send('Please provide a valid number.');
    await message.channel.setRateLimitPerUser(seconds);
    message.channel.send(`⏱️ Slowmode set to ${seconds} seconds.`);
  }
};