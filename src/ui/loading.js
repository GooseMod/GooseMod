let loadingToast = undefined;

export const startLoadingScreen = () => {
  loadingToast = globalThis.showToast('Injecting GooseMod: Starting...', { timeout: 99999 });
};

export const updateLoadingScreen = (tip) => {
  loadingToast.toastElem.innerHTML = `Injecting GooseMod: ${tip}`;
};

export const stopLoadingScreen = () => {
  loadingToast.toastElem.innerHTML = `GooseMod has injected successfully`;

  loadingToast.closeFn();
};