let goosemodScope = {};

export default {
  setThisScope: (scope) => {
    goosemodScope = scope;
  },

  eggs: [
    {
      text: 'Goose Emoji',
      message: 'Did you know there is no goose emoji? The most used one as a standin is a swan (\u{1F9A2}). Very sad.'
    },
    {
      text: 'That\'s Numberwang!',
      message: 'That\'s Wangernum!'
    },
    {
      text: 'When does Atmosphere come out?',
      message: 'June 15th!'
    },
    {
      text: 'What is the meaning of life?',
      message: '42, duh.'
    },
    {
      text: 'Honk',
      message: 'Honk',
      audio: 'https://cdn.discordapp.com/attachments/756146058924392542/784196129679343656/honk.mp3'
    },
    {
      text: 'GooseMod',
      message: 'You talking about me? ;)'
    }
  ],

  interval: 0,

  check: () => {
    let el = document.getElementsByClassName('slateTextArea-1Mkdgw')[0];

    if (!el) return;

    for (let e of goosemodScope.messageEasterEggs.eggs) {
      if (el.textContent === e.text) {
        if (e.cooldown) {
          e.cooldown -= 1;
          continue;
        }

        goosemodScope.showToast(e.message);
        
        if (e.audio) {
          const a = new Audio(e.audio);
          
          a.play();
          
          a.onended = () => {
            a.remove();
          };
        }

        e.cooldown = (e.cooldown || 6) - 1;
      }
    }
  }
};
