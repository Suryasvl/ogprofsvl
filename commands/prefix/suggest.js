module.exports = {
  name: 'suggest',
  execute: (message, args) => {
    const suggestion = args.join(' ');
    if (!suggestion) return message.channel.send('Please enter a suggestion.');

    const embed = {
      title: '📬 New Suggestion',
      description: suggestion,
      footer: { text: `From ${message.author.tag}` },
      color: 0x00AE86,
    };

    const channel = message.guild.channels.cache.find(ch => ch.name.includes('suggest'));
    if (!channel) return message.channel.send('Suggestion channel not found.');
    channel.send({ embeds: [embed] });
    message.channel.send('✅ Suggestion sent!');
  }
};