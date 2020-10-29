let goosemodScope = {};

let noCSPFetch;

export default {
  setThisScope: (scope) => {
    goosemodScope = scope;
  },

  noCSPFetch: undefined,

  init: async () => {
    if (window.goosemod_noCSPFetch) {
      noCSPFetch = window.goosemod_noCSPFetch;

      delete window.goosemod_noCSPFetch;

      return;
    }

    let el = document.createElement('object');

    el.data = location.origin;
    document.body.appendChild(el);

    /*let script = document.createElement('script');
    script.type = 'text/javascript';

    let code = `
window.addEventListener('message', async (e) => {
  const { url, type, useCORSProxy, useCache } = e.data;

  if (!url) return;

  const req = await fetch(url, {
    cache: useCache ? 'default' : 'no-store'
  });

  e.source.postMessage({ verify: url, data: await req[type]() });
});`;

    script.appendChild(document.createTextNode(code));

    goosemodScope.cspBypasser.frame.contentDocument.head.appendChild(script);*/

    noCSPFetch = el.contentWindow.fetch;
  },


  fetch: (url, type, useCORSProxy = true) => {
    return new Promise(async (finalRes) => {
      const sendURL = useCORSProxy ? `https://cors-anywhere.herokuapp.com/${url}` : url;

      const sendType = type === 'img' ? 'blob' : type;

      const req = await noCSPFetch(sendURL);
      const resp = await req[sendType]();

      if (type === 'img') {
        resp = URL.createObjectURL(resp);
      }

      return finalRes(resp);
    });
  },

  json: (url, useCORSProxy) => goosemodScope.cspBypasser.fetch(url, 'json', useCORSProxy),

  text: (url, useCORSProxy) => goosemodScope.cspBypasser.fetch(url, 'text', useCORSProxy),

  blob: (url, useCORSProxy) => goosemodScope.cspBypasser.fetch(url, 'blob', useCORSProxy),

  image: (url, useCORSProxy) => goosemodScope.cspBypasser.fetch(url, 'img', useCORSProxy),
};