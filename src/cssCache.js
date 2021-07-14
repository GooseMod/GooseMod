let css = '';
let toSaveNext = false;

export const init = () => {
  injectHooks();

  setInterval(() => { // Use interval to only save every 10s max
    if (!toSaveNext) return;
    toSaveNext = false;

    save();
  }, 10000);
};

const save = () => {
  [...document.body.classList].forEach((x) => { // A lot of (old) GM css relies on body classes for settings, so replace all body.<existing_class> to body
    css = css.replace(new RegExp(`body.${x}`, 'g'), `body`)
  });

  goosemod.storage.set('goosemodCSSCache', css);

  goosemod.showToast('Saved', { subtext: 'CSS Cache', type: 'debuginfo' });
};

const injectHooks = () => {
  const triggerSave = () => toSaveNext = true;

  const _insertRule = CSSStyleSheet.prototype.insertRule;
  const _appendChild = Node.prototype.appendChild;

  CSSStyleSheet.prototype.insertRule = function(cssText) {
    _insertRule.apply(this, arguments);

    if (!cssText.includes('body.')) return; // Most GM plugins which do insertRule use body class selectors, so make sure as we don't want to include Discord's dynamic styles

    css += cssText;
    triggerSave();
  };

  const elementsToAppendHook = [ document.body, document.head ];

  const hookElement = (parentEl) => {
    parentEl.appendChild = function (el) {
      _appendChild.apply(this, arguments);

      if (el.tagName === 'STYLE') { // Style element
        if (el.id.startsWith('ace')) return; // Ignore Ace editor styles

        hookElement(el); // Hook so future appends to the style are caught

        for (const t of el.childNodes) { // Catch current CSS
          css += t.textContent;
        }

        triggerSave();
      }

      if (el.data) { // Text node being appended to style
        css += el.textContent;

        triggerSave();
      }
    };
  };

  for (const el of elementsToAppendHook) {
    hookElement(el);
  }
};

export const load = () => {
  const el = document.createElement('style');
  el.id = `gm-css-cache`;

  el.appendChild(document.createTextNode(goosemod.storage.get('goosemodCSSCache') || ''));

  document.body.appendChild(el);

  goosemod.showToast('Loaded', { subtext: 'CSS Cache', type: 'debuginfo' });

  init();
};

export const removeStyle = () => {
  const el = document.getElementById(`gm-css-cache`);
  if (!el) return;

  el.remove();
};