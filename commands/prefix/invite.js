module.exports = {
  name: 'invite',
  execute: (message) => {
    const link = `https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&permissions=8&scope=bot%20applications.commands`;
    message.channel.send(`🔗 [Click here to invite me!](${link})`);
  }
};