module.exports = {
  name: 'uptime',
  execute: (message) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    message.channel.send(`⏱ Bot uptime: ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`);
  }
};