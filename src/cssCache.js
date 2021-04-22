let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};


export const save = () => {
  const styles = [...document.querySelectorAll(`style:not([data-emotion])`)];

  const allCss = styles.map((x) => {
    let css = x.textContent;

    // Some minification (trimming)
    css = css.split('\n').map((y) => y.trim()).join(' ');

    [...document.body.classList].forEach((x) => { // A lot of (old) GM css relies on body classes for settings, so replace all body.<existing_class> to body
      css = css.replaceAll(`body.${x}`, `body`)
    });

    return css;
  }).join(' ');

  localStorage.setItem(`goosemodCSSCache`, allCss);
};

export const load = () => {
  const cache = localStorage.getItem('goosemodCSSCache');

  if (!cache) return; // No cache stored

  const el = document.createElement('style');
  el.id = `gm-css-cache`;

  el.appendChild(document.createTextNode(cache));

  document.body.appendChild(el);
};

export const removeStyle = () => {
  const el = document.getElementById(`gm-css-cache`);
  if (!el) return;

  el.remove();
};