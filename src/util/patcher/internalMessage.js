let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;

  const { BOT_AVATARS } = goosemodScope.webpackModules.findByProps('BOT_AVATARS', 'DEFAULT_AVATARS');

  BOT_AVATARS.GooseMod = 'https://cdn.discordapp.com/avatars/760559484342501406/5125aff2f446ad7c45cf2dfd6abf92ed.webp'; // Add avatar image
};


export const send = (content, author = 'GooseMod') => {
  // Get Webpack Modules
  const { createBotMessage } = goosemodScope.webpackModules.findByProps('createBotMessage');
  const { getChannelId } = goosemodScope.webpackModules.findByProps('getChannelId');
  const { receiveMessage } = goosemodScope.webpackModules.findByProps('receiveMessage', 'sendBotMessage');

  const msg = createBotMessage(getChannelId(), '');

  if (typeof content === 'string') {
    msg.content = content;
  } else {
    msg.embeds.push(content);
  }

  msg.state = 'SENT'; // Set Clyde-like props
  msg.author.id = '1';
  msg.author.bot = true;
  msg.author.discriminator = '0000';

  msg.author.avatar = 'GooseMod'; // Allow custom avatar URLs in future? (via dynamic BOT_AVATARS adding)
  msg.author.username = author;

  receiveMessage(getChannelId(), msg);
};