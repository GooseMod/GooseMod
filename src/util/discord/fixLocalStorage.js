// Bypass to get Local Storage (Discord block / remove it) - Source / credit: https://stackoverflow.com/questions/52509440/discord-window-localstorage-is-undefined-how-to-get-access-to-the-localstorage
function getLocalStoragePropertyDescriptor() {
  const frame = document.createElement('frame');
  frame.src = 'about:blank';

  document.body.appendChild(frame);

  let r = Object.getOwnPropertyDescriptor(frame.contentWindow, 'localStorage');

  frame.remove();

  return r;
}

export default () => {
  Object.defineProperty(window, 'localStorage', getLocalStoragePropertyDescriptor());
};