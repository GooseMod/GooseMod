try {
  if (typeof require === 'undefined') { // Web
    require = () => ({ webFrame: { top: { context: undefined } } });
  }

  (require('electron').webFrame.top.context || window).eval(`
  (async function() {
    window.gmUntethered = '2.2.1';

    let el = document.getElementsByClassName('fixClipping-3qAKRb')[0];
    if (el !== undefined) el.style.backgroundColor = '#050505';

    let el2 = document.getElementsByClassName('tip-2cgoli')[0];
    if (el2 !== undefined) el2.innerHTML += \`<br><br>GooseMod Untethered v\${window.gmUntethered}\`;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const awaitIframe = (iframe) => {
      return new Promise((res) => {
        iframe.addEventListener("load", function() {
          res();
        });
      })
    };
    
    this.cspBypasser = {
      frame: document.createElement('iframe'),
      
      init: async () => {
        this.cspBypasser.frame.src = \`\${location.origin}/api/gateway\`;
        document.body.appendChild(this.cspBypasser.frame);
        
        await awaitIframe(this.cspBypasser.frame);
        
        let script = document.createElement('script');
        script.type = 'text/javascript';
        
        let code = \`
        window.addEventListener('message', async (e) => {
          const {url, type} = e.data;
          
          const proxyURL = \\\`https://cors-anywhere.herokuapp.com/\\\${url}\\\`;
          
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
              
              e.source.postMessage(canvas.toDataURL("image/png"));
            };
            
            return;
          }       
          
          const req = await fetch(proxyURL, {
            cache: 'no-store'
          });
          
          e.source.postMessage(type === 'json' ? await req.json() : (type === 'text' ? await req.text() : await req.blob()));
        }, false);\`;
        
        script.appendChild(document.createTextNode(code));
        
        this.cspBypasser.frame.contentDocument.head.appendChild(script);
      },
      
      runCode: (code) => {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        
        script.appendChild(document.createTextNode(code));
        
        this.cspBypasser.frame.contentDocument.head.appendChild(script);
      },
      
      json: (url) => {
        return new Promise((res) => {
          this.cspBypasser.frame.contentWindow.postMessage({url, type: 'json'});
          
          window.addEventListener('message', async (e) => {
            res(e.data);
          }, false);
        });
      },
      
      text: (url) => {
        return new Promise((res) => {
          this.cspBypasser.frame.contentWindow.postMessage({url, type: 'text'});
          
          window.addEventListener('message', async (e) => {
            res(e.data);
          }, false);
        });
      },
      
      blob: (url) => {
        return new Promise((res) => {
          this.cspBypasser.frame.contentWindow.postMessage({url, type: 'blob'});
          
          window.addEventListener('message', async (e) => {
            res(e.data);
          }, false);
        });
      },
      
      image: (url) => {
        return new Promise((res) => {
          this.cspBypasser.frame.contentWindow.postMessage({url, type: 'img'});
          
          window.addEventListener('message', async (e) => {
            res(e.data);
          }, false);
        });
      },
    };
    
    await this.cspBypasser.init();

    const code = this.cspBypasser.text('https://gitdab.com/duck/GooseMod/raw/branch/master/src/inject.js');

    if (el2 !== undefined) el2.innerHTML += \`<br>Ready\`;
    
    while (true) {
      if (document.querySelector('button[aria-label="User Settings"]') !== null) break;
      
      await sleep(50);
    }
    
    (async function(cspBypasser, code) { eval(code); })(this.cspBypasser, await code);
  }).bind({})();`);
} catch (e) { console.error(e); }