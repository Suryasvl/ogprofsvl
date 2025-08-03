const fs = require('fs');
const path = './staff.json';

module.exports = {
  name: 'smark',
  execute(message) {
    const userId = message.author.id;
    const name = message.author.tag;
    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    data[userId] = { name, timestamp };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    message.channel.send(`<@${userId}> marked attendance at ${timestamp}`);
  }
};