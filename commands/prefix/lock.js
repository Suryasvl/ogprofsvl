module.exports = {
  name: 'lock',
  execute: async (message) => {
    if (!message.member.permissions.has('ManageChannels')) return;
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false,
    });
    message.channel.send('🔒 Channel locked');
  },
};