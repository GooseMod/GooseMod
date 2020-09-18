let version = '1.0.0';

let obj = {
  onImport: async function () {
    this.logger.debug('rainbowMode', 'Enabling Rainbow Tweaks');

    this.r_tweaks = {
      'rainbowMode': true
    };

    let sheet = window.document.styleSheets[0];
    let tweakrules = [];

    let tweakFunctions = {
      'rainbowMode': {
        enable: () => {
          tweakrules.push(sheet.insertRule(`.messageContent-2qWWxC {
            background: repeating-linear-gradient(45deg, violet, indigo, blue, green, yellow, orange, red);
            -webkit-background-clip: text;
            color: transparent;
            background-size: 800% 800%;
            animation: rainbow 8s ease infinite;
          }`, sheet.cssRules.length));

          tweakrules.push(sheet.insertRule(`code.inline {
            color: #fff;
          }`, sheet.cssRules.length));

          tweakrules.push(sheet.insertRule(`@keyframes rainbow { 
            0%{background-position:0% 50%}
            50%{background-position:100% 25%}
            100%{background-position:0% 50%}
          }`, sheet.cssRules.length));
        },

        disable: () => {
          for (let i = 0; i < tweakrules.length; i++) {
            sheet.deleteRule(tweakrules[i]);
          }
        }
      }
    };

    this.r_enableTweak = (tweakName) => {
      tweakFunctions[tweakName].enable();

      this.r_tweaks[tweakName] = true;
    };

    this.r_disableTweak = (tweakName) => {
      tweakFunctions[tweakName].disable();

      this.r_tweaks[tweakName] = false;
    };

    this.r_setTweak = (tweakName, value) => {
      if (value === true) {
        this.r_enableTweak(tweakName);
      } else {
        this.r_disableTweak(tweakName);
      }
    };
  },

  onLoadingFinished: async function () {
    for (let t in this.r_tweaks) {
      if (this.r_tweaks[t] === true) this.r_enableTweak(t);
    }

    this.settings.createItem('RainbowCord', [
      `(v${version})`,

      {
        type: 'header',
        text: 'Themes'
      },
      {
        type: 'toggle',
        text: 'Rainbow Mode',
        subtext: 'Messages are rainbow',
        onToggle: (c) => { this.r_setTweak('rainbowMode', c); },
        isToggled: () => this.r_tweaks['rainbowMode']
      }
    ]);
  },

  remove: async function () {
    for (let t in this.r_tweaks) {
      if (this.r_tweaks[t] === true) this.r_disableTweak(t);
    }

    let settingItem = this.settings.items.find((x) => x[1] === 'RainbowCord');
    this.settings.items.splice(this.settings.items.indexOf(settingItem), 1);
  },

  logRegionColor: 'black',

  name: 'RainbowCord',
  description: 'Rainbow mode',

  author: 'Fjorge',

  version
};

obj