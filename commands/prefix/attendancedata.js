const fs = require('fs');
const path = './staff.json';

module.exports = {
  name: 'sdata',
  execute(message) {
    if (!fs.existsSync(path)) return message.channel.send('No attendance data found.');

    const data = JSON.parse(fs.readFileSync(path));
    let msg = '**📋 Staff Attendance Data:**\n\n';
    for (const id in data) {
      msg += `👤 **${data[id].name}** - 🕒 ${data[id].timestamp}\n`;
    }

    message.channel.send(msg);
  }
};