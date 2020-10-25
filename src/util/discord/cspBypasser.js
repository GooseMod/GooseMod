let goosemodScope = {};

export default {
  setThisScope: (scope) => {
    goosemodScope = scope;
  },

  frame: document.createElement('iframe'),

  init: async () => {
    goosemodScope.cspBypasser.frame.src = 'discord:';
    document.body.appendChild(goosemodScope.cspBypasser.frame);

    //await awaitIframe(goosemodScope.cspBypasser.frame);

    let script = document.createElement('script');
    script.type = 'text/javascript';

    let code = `
    window.addEventListener('message', async (e) => {
      const {url, type, useCORSProxy} = e.data;

      if (!url) return;

      const proxyURL = useCORSProxy ? \`https://cors-anywhere.herokuapp.com/\${url}\` : url;

      if (type === 'img') {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        let img = new Image();
        img.src = proxyURL;
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          e.source.postMessage({ verify: url, data: canvas.toDataURL("image/png") });
        };

        return;
      }       
      
      const req = await fetch(proxyURL, {
        cache: 'no-store'
      });

      e.source.postMessage({ verify: url, data: await req[type]() });
    });`;

    script.appendChild(document.createTextNode(code));

    goosemodScope.cspBypasser.frame.contentDocument.head.appendChild(script);
  },

  runCode: (code) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';

    script.appendChild(document.createTextNode(code));

    goosemodScope.cspBypasser.frame.contentDocument.head.appendChild(script);
  },

  json: (url, useCORSProxy = true) => {
    return new Promise((res) => {
      goosemodScope.cspBypasser.frame.contentWindow.postMessage({url, type: 'json', useCORSProxy});

      window.addEventListener('message', async (e) => {
        if (e.data.verify !== url) return;

        res(e.data.data);
      });
    });
  },

  text: (url, useCORSProxy = true) => {
    return new Promise((res) => {
      goosemodScope.cspBypasser.frame.contentWindow.postMessage({url, type: 'text', useCORSProxy});

      window.addEventListener('message', async (e) => {
        if (e.data.verify !== url) return;

        res(e.data.data);
      });
    });
  },

  blob: (url, useCORSProxy = true) => {
    return new Promise((res) => {
      goosemodScope.cspBypasser.frame.contentWindow.postMessage({url, type: 'blob', useCORSProxy});

      window.addEventListener('message', async (e) => {
        if (e.data.verify !== url) return;

        res(e.data.data);
      });
    });
  },

  image: (url, useCORSProxy = true) => {
    return new Promise((res) => {
      goosemodScope.cspBypasser.frame.contentWindow.postMessage({url, type: 'img', useCORSProxy});

      window.addEventListener('message', async (e) => {
        if (e.data.verify !== url) return;

        res(e.data.data);
      });
    });
  },
};