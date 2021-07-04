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


.gm-toast.toast-info {
  background-color: hsla(197,calc(var(--saturation-factor, 1)*100%),47.8%, 0.5);
}

.gm-toast.toast-success {
  background-color: hsla(139,calc(var(--saturation-factor, 1)*66.8%),58.6%, 0.5);
}

.gm-toast.toast-danger,
.gm-toast.toast-error {
  background-color: hsla(359,calc(var(--saturation-factor, 1)*82.6%),59.4%, 0.5);
}

.gm-toast.toast-warning,
.gm-toast.toast-warn {
  background-color: hsla(38,calc(var(--saturation-factor, 1)*95.7%),54.1%, 0.5);
}`;

const styleSheet = document.createElement('style'); // Add CSS as stylesheet
styleSheet.textContent = toastCSS;
document.head.appendChild(styleSheet);

export default (text, options = {}) => {
  if (options?.type?.startsWith('debug')) {
    if (!goosemod.settings.gmSettings.get().debugToasts) return;

    options.type = options.type.replace('debug', '');
  } 

  if (!document.querySelector('.gm-toasts')) {
    const toastWrapper = document.createElement('div');

    toastWrapper.classList.add('gm-toasts');

    document.querySelector('#app-mount').appendChild(toastWrapper);
  }

  let { subtext = '', type = '', timeout = 3000 } = options;
  timeout *= 1.5;

  const toastElem = document.createElement('div');
  toastElem.classList.add('gm-toast');

  if (type) toastElem.classList.add('toast-' + type);

  const textEl = document.createElement('div');
  textEl.textContent = text;
  
  toastElem.appendChild(textEl);

  const subtextEl = document.createElement('div');
  subtextEl.textContent = subtext;

  toastElem.appendChild(subtextEl);

  document.querySelector('.gm-toasts').appendChild(toastElem);

  const closeFn = () => {
    toastElem.classList.add('closing');

    setTimeout(() => {
        toastElem.remove();
        if (!document.querySelectorAll('.gm-toasts .gm-toast').length) document.querySelector('.gm-toasts').remove();
    }, 300);
  };

  setTimeout(closeFn, timeout);

  return { toastElem, closeFn };
};