const fs = require('fs');
const path = './staff.json';

module.exports = {
  name: 'sactivity',
  execute(message) {
    const mention = message.mentions.users.first();
    if (!mention) return message.channel.send('Please mention a user.');

    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    const user = data[mention.id];

    if (!user) return message.channel.send('No attendance record for this user.');
    message.channel.send(`🧾 **${user.name}** was last marked present at 🕒 ${user.timestamp}`);
  }
};