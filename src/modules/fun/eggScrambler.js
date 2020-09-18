let version = '1.0.0';

let interval;

function scrambleMessages() {
  interval = setInterval(function () {
    let messages = document.getElementsByClassName("messageContent-2qWWxC");

    for (let message of messages) {
      message.textContent = [...message.textContent].fill('\u{1F95A}').join('');
    }
  }, 500);
}

let obj = {
    // Activating module
    onImport: async function () {
        this.logger.debug('scrambleMessages', 'Starting Egg...');
        scrambleMessages();
    },

    // Removing function
    remove: async function () {
        clearInterval(interval);
    },
        
    // Random thing I don't rlly want
    logRegionColor: 'red',

    // Data
    name: 'Egg Scrambler',
    description: 'Makes discord unusable by converting all messages into eggs',

    author: 'Fjorge + Hax + Ducko',

    version: version
};

obj