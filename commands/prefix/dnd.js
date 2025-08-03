const fs = require('fs');

module.exports = {
  dnd: (message) => {
    const args = message.content.split(' ');
    const minutes = parseInt(args[1]);
    if (!minutes || isNaN(minutes)) return message.reply("Please specify time in minutes.");

    let dnd = {};
    if (fs.existsSync('./dnd.json')) {
      dnd = JSON.parse(fs.readFileSync('./dnd.json', 'utf8'));
    }

    const returnTime = Date.now() + minutes * 60000;
    dnd[message.author.id] = returnTime;
    fs.writeFileSync('./dnd.json', JSON.stringify(dnd));

    message.reply(`You are now in DND for ${minutes} minutes.`);
  }
};