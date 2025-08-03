// commands/prefix/channelinfo.js
module.exports = {
  name: "channelinfo",
  execute(message) {
    const channel = message.channel;
    message.channel.send(`ℹ️ **Channel Info**
Name: ${channel.name}
ID: ${channel.id}
Type: ${channel.type}
Topic: ${channel.topic || 'None'}`);
  }
};