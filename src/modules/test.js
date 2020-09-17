let obj = {
  onImport: async function() {
    console.log('from test module: onImport handler ran');
  },

  onImportsFinished: async function() {
    console.log('from test module: onImportsFinished handler ran');
  },
};

obj