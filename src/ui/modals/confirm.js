let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const show = (buttonText, title, description) => {
  return new Promise((res) => {
    const { React } = goosemodScope.webpackModules.common;
    const { findByDisplayName, findByProps } = goosemodScope.webpackModules;
    
    const Text = findByDisplayName("Text");
    
    (0, findByProps("openModal").openModal)((e) => {
      if (e.transitionState === 3) res(false); // If clicked off

      return React.createElement(findByDisplayName("ConfirmModal"),
        {
          header: title,
          confirmText: buttonText,
          cancelText: findByProps("Messages").Messages.CANCEL,
          onClose: () => { // General close (?)
            res(false);
          },
          onCancel: () => { // Cancel text
            res(false);
            e.onClose();
          },
          onConfirm: () => { // Confirm button
            res(true);
            e.onClose();
          },
          transitionState: e.transitionState,
        },
        React.createElement(Text,
          {
            size: Text.Sizes.SIZE_16
          },
          description
        )
      );
    });
  });
};