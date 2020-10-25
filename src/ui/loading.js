let loadingToast = undefined;

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const startLoadingScreen = () => {
  loadingToast = goosemodScope.showToast('Injecting GooseMod: Starting...', { timeout: 99999 });
};

export const updateLoadingScreen = (tip) => {
  loadingToast.toastElem.innerHTML = `Injecting GooseMod: ${tip}`;
};

export const stopLoadingScreen = () => {
  loadingToast.toastElem.innerHTML = `GooseMod has injected successfully`;

  loadingToast.closeFn();
};