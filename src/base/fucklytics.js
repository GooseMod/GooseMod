let enabled = true;

let blocking = {
  'science': true,
  'sentry': true
};

let obj = {
  onImport: async function() {
    let gooseModScope = this;


    this.logger.debug('fucklytics', 'Overriding XMLHTTPRequest with a proxy function');

    let _XMLHttpRequest = XMLHttpRequest;

    window.XMLHttpRequest = function() {
      var xhr = new _XMLHttpRequest();
  
      var _open = xhr.open;
      xhr.open = function() {
          //console.log(this, arguments, arguments[1], arguments[1].includes('science'));
          if (enabled) {
            if (blocking['science'] === true && arguments[1].includes('/v8/science')) {
              gooseModScope.logger.debug('fucklytics', 'Blocked analytics request (science)');

              return false;
            }

            if (blocking['sentry'] === true && arguments[1].includes('https://sentry.io')) {
              gooseModScope.logger.debug('fucklytics', 'Blocked analytics request (sentry)');

              return false;
            }
          }

          return _open.apply(this, arguments);
      }
  
      return xhr;
    }
  },

  onLoadingFinished: async function() {
    this.settings.createItem('Fucklytics', [
      {
        type: 'toggle',
        text: 'Fucklytics Enabled',
        onToggle: (c) => { enabled = c; },
        isToggled: () => enabled
      },

      {
        type: 'header',
        text: 'Types to Block'
      },

      {
        type: 'toggle',
        text: 'Science (Discord API)',
        onToggle: (c) => { blocking['science'] = c; },
        isToggled: () => blocking['science']
      },
      {
        type: 'toggle',
        text: 'Sentry.io',
        onToggle: (c) => { blocking['sentry'] = c; },
        isToggled: () => blocking['sentry']
      }
    ]);
  },

  logRegionColor: 'darkblue'
};

obj