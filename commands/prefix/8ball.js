// commands/prefix/8ball.js
module.exports = {
  name: "8ball",
  execute(message) {
    const answers = ["Yes", "No", "Maybe", "Definitely", "Ask again later"];
    const question = message.content.split(' ').slice(1).join(' ');
    if (!question) return message.reply("Ask a full question.");
    const response = answers[Math.floor(Math.random() * answers.length)];
    message.channel.send(`🎱 ${response}`);
  }
};