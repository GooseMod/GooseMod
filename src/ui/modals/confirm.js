let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const show = (buttonText, title, description, cancelText = undefined, confirmButtonColor = undefined) => {
  return new Promise((res) => {
    const { React } = goosemodScope.webpackModules.common;
    const { findByDisplayName, findByProps } = goosemodScope.webpackModules;
    
    const Text = findByDisplayName("Text");
    const Markdown = findByDisplayName('Markdown');
    const ButtonColors = findByProps('button', 'colorRed');
    
    (0, findByProps("openModal").openModal)((e) => {
      if (e.transitionState === 3) res(false); // If clicked off

      return React.createElement(findByDisplayName("ConfirmModal"),
        {
          header: title,
          confirmText: buttonText,
          cancelText: cancelText || findByProps("Messages").Messages.CANCEL,
          confirmButtonColor: ButtonColors[`color${confirmButtonColor ? (confirmButtonColor[0].toUpperCase() + confirmButtonColor.substring(1).toLowerCase()) : 'Red'}`],
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
        ...description.split('\n').map((x) => React.createElement(Markdown,
          {
            size: Text.Sizes.SIZE_16
          },
          x))
      );
    });
  });
};