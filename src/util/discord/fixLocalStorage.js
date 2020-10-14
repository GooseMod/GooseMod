// Bypass to get Local Storage (Discord block / remove it) - Source / credit: https://stackoverflow.com/questions/52509440/discord-window-localstorage-is-undefined-how-to-get-access-to-the-localstorage
function getLocalStoragePropertyDescriptor() {
  const iframe = document.createElement('iframe');
  document.head.append(iframe);

  const pd = Object.getOwnPropertyDescriptor(iframe.contentWindow, 'localStorage');

  iframe.remove();

  return pd;
}

export default () => {
  Object.defineProperty(window, 'localStorage', getLocalStoragePropertyDescriptor());
};