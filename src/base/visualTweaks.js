let obj = {
  onImport: async function() {
    this.logger.debug('visualTweaks', 'Enabling Visual Tweaks');
    
    this.tweaks = {
      'removeHelpButton': true
    };
    
    let tweakFunctions = {
      'removeHelpButton': {
        enable: () => {
          document.querySelector('a[href="https://support.discord.com"] > div[role="button"]').parentElement.style.display = 'none';
        },
        
        disable: () => {
          document.querySelector('a[href="https://support.discord.com"] > div[role="button"]').parentElement.style.display = 'flex';
        }
      }
    };
    
    this.enableTweak = (tweakName) => {
      tweakFunctions[tweakName].enable();

      this.tweaks[tweakName] = true;
    };
    
    this.disableTweak = (tweakName) => {
      tweakFunctions[tweakName].disable();

      this.tweaks[tweakName] = false;
    };
    
    this.setTweak = (tweakName, value) => {
      if (value === true) {
        this.enableTweak(tweakName);
      } else {
        this.disableTweak(tweakName);
      }
    };
    
    for (let t in this.tweaks) {
      this.enableTweak(t);
    }
  },
  
  onLoadingFinished: async function() {
    this.settings.createItem('Visual Tweaks', [
      {
        type: 'header',
        text: 'Individual Minor Tweaks'
      },
      {
        type: 'toggle',
        text: 'Hide Help Button',
        onToggle: (c) => { this.setTweak('removeHelpButton', c); },
        isToggled: () => this.tweaks['removeHelpButton']
      }
    ]);
  },
  
  logRegionColor: 'darkred'
};

obj