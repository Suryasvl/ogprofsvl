module.exports = {
  name: 'unlock',
  execute: async (message) => {
    if (!message.member.permissions.has('ManageChannels')) return;
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: true,
    });
    message.channel.send('🔓 Channel unlocked!');
  }
};