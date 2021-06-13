/* Toasts from BBD, slightly modified to fit CSS variables and tweaked to liking - full credit and sources:
  ** CSS: https://github.com/rauenzi/BetterDiscordApp/blob/master/src/styles/index.css
  ** JS: https://github.com/rauenzi/BetterDiscordApp/blob/master/src/modules/utils.js
  ** Again huge thanks to Rauenzi / (B)BD for basing some ideas and code (especially related to webpack modules)
  ** (Classes renamed to not interfere with (B)BD installed alongside)
*/

const toastCSS = `.gm-toasts {
  position: fixed;
  display: flex;
  top: 0;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
  z-index: 4000;

  bottom: 80px;
  right: 40px;
}

@keyframes gm-toast-up {
  from {
      transform: translateY(0);
      opacity: 0;
  }
}

.gm-toast {
  animation: gm-toast-up 300ms ease;
  background: rgba(79,84,92,0.5);
  backdrop-filter: blur(2px);
  padding: 22px;
  border-radius: 6px;
  box-shadow: var(--elevation-high);
  font-weight: 500;
  color: #fff;
  user-select: text;
  font-size: 20px;
  opacity: 1;
  margin-top: 40px;
  pointer-events: none;
  user-select: none;

  width: 280px;
  text-align: left;

  overflow-wrap: break-word;
}

.gm-toast > :first-child {
  margin-bottom: 12px;
}

.gm-toast > :last-child {
  color: var(--header-secondary);
  font-size: 18px;
}

@keyframes gm-toast-down {
  to {
      transform: translateY(0px);
      opacity: 0;
  }
}

.gm-toast.closing {
  animation: gm-toast-down 200ms ease;
  animation-fill-mode: forwards;
  opacity: 1;
  transform: translateY(-10px);
}


.gm-toast.icon {
  padding-left: 30px;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: 6px 50%;
}

.gm-toast.toast-info {
  background-color: hsla(197,calc(var(--saturation-factor, 1)*100%),47.8%, 0.5);
}

.gm-toast.toast-info.icon {
  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMSAxNWgtMnYtNmgydjZ6bTAtOGgtMlY3aDJ2MnoiLz48L3N2Zz4=);
}

.gm-toast.toast-success {
  background-color: hsla(139,calc(var(--saturation-factor, 1)*66.8%),58.6%, 0.5);
}

.gm-toast.toast-success.icon {
  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz48L3N2Zz4=);
}

.gm-toast.toast-danger,
.gm-toast.toast-error {
  background-color: hsla(359,calc(var(--saturation-factor, 1)*82.6%),59.4%, 0.5);
}

.gm-toast.toast-danger.icon,
.gm-toast.toast-error.icon {
  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTEyIDJDNi40NyAyIDIgNi40NyAyIDEyczQuNDcgMTAgMTAgMTAgMTAtNC40NyAxMC0xMFMxNy41MyAyIDEyIDJ6bTUgMTMuNTlMMTUuNTkgMTcgMTIgMTMuNDEgOC40MSAxNyA3IDE1LjU5IDEwLjU5IDEyIDcgOC40MSA4LjQxIDcgMTIgMTAuNTkgMTUuNTkgNyAxNyA4LjQxIDEzLjQxIDEyIDE3IDE1LjU5eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+);
}

.gm-toast.toast-warning,
.gm-toast.toast-warn {
  background-color: hsla(38,calc(var(--saturation-factor, 1)*95.7%),54.1%, 0.5);
}

.gm-toast.toast-warning.icon,
.gm-toast.toast-warn.icon {
  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMSAyMWgyMkwxMiAyIDEgMjF6bTEyLTNoLTJ2LTJoMnYyem0wLTRoLTJ2LTRoMnY0eiIvPjwvc3ZnPg==);
}`;

const styleSheet = document.createElement('style'); // Add CSS as stylesheet
styleSheet.textContent = toastCSS;
document.head.appendChild(styleSheet);

export default (text, options = {}) => {
  if (!document.querySelector('.gm-toasts')) {
    const toastWrapper = document.createElement('div');

    toastWrapper.classList.add('gm-toasts');

    document.querySelector('#app-mount').appendChild(toastWrapper);
  }

  let { subtext = '', type = '', icon = false, timeout = 3000 } = options;
  timeout *= 1.5;

  const toastElem = document.createElement('div');
  toastElem.classList.add('gm-toast');

  if (type) toastElem.classList.add('toast-' + type);
  if (type && icon) toastElem.classList.add('icon');

  const textEl = document.createElement('div');
  textEl.textContent = text;
  
  toastElem.appendChild(textEl);

  const subtextEl = document.createElement('div');
  subtextEl.textContent = subtext;

  toastElem.appendChild(subtextEl);

  document.querySelector('.gm-toasts').appendChild(toastElem);

  let closeFn = () => {
    toastElem.classList.add('closing');
    setTimeout(() => {
        toastElem.remove();
        if (!document.querySelectorAll('.gm-toasts .gm-toast').length) document.querySelector('.gm-toasts').remove();
    }, 300);
  };

  setTimeout(closeFn, timeout);

  return { toastElem, closeFn };
};