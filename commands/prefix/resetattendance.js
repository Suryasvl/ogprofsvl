const fs = require('fs');
const path = './staff.json';

module.exports = {
  name: 'sreset',
  execute(message) {
    if (!message.member.permissions.has('Administrator')) return;
    if (fs.existsSync(path)) fs.unlinkSync(path);
    message.channel.send('✅ Staff attendance has been reset.');
  }
};