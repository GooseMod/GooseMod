export default (buttonText, title, description) => {
  return new Promise((res) => {
  //Making the div boxes to house the stuff
  let confirmELContainer = document.createElement('div');
  confirmELContainer.classList.add('layerContainer-yqaFcK');

  let confirmELLayer = document.createElement('div');
  confirmELLayer.classList.add('layer-2KE1M9');

  let confirmEL = document.createElement('div');
  confirmEL.classList.add("focusLock-Ns3yie");
  confirmEL.setAttribute('role', 'dialog');
  confirmEL.setAttribute('aria-label', title);
  confirmEL.setAttribute('tabindex', '-1');
  confirmEL.setAttribute('aria-model', 'true');

  let confirmELRoot = document.createElement('div');
  confirmELRoot.classList.add("root-1gCeng", "small-3iVZYw", "fullscreenOnMobile-1bD22y");
  confirmELRoot.style.opacity = '1';
  confirmELRoot.style.transform = 'scale(1)';

  //Header stuff
  let confirmELHeaderDiv = document.createElement('div');
  confirmELHeaderDiv.classList.add('flex-1xMQg5', 'flex-1O1GKY', 'horizontal-1ae9ci', 'horizontal-2EEEnY', 'flex-1O1GKY', 'directionRow-3v3tfG', 'justifyStart-2NDFzi', 'alignCenter-1dQNNs', 'noWrap-3jynv6', 'header-1TKi98');
  confirmELHeaderDiv.style.flex = '0 0 auto';

  let confirmElHeaderH = document.createElement('h4');
  confirmElHeaderH.classList.add("colorStandard-2KCXvj", "size14-e6ZScH", "h4-AQvcAz", "title-3sZWYQ", "defaultColor-1_ajX0", "defaultMarginh4-2vWMG5");
  confirmElHeaderH.textContent = title;

  //Body stuff
  let confirmELBody = document.createElement('div');
  confirmELBody.classList.add('content-1LAB8Z', 'content-mK72R6', 'thin-1ybCId', 'scrollerBase-289Jih');
  confirmELBody.setAttribute('dir', 'ltr');
  confirmELBody.style.overflow = 'hidden scroll';
  confirmELBody.style.paddingRight = '8px';

  let confirmELBodyText = document.createElement('div')
  confirmELBodyText.classList.add('colorStandard-2KCXvj', 'size16-1P40sf')
  confirmELBodyText.textContent = description;

  let confirmELBodyWhitespace = document.createElement('div');
  confirmELBodyWhitespace.setAttribute('aria-hidden', 'true');
  confirmELBodyWhitespace.style.position = 'absolute';
  confirmELBodyWhitespace.style.pointerEvents = 'none';
  confirmELBodyWhitespace.style.minHeight = '0px';
  confirmELBodyWhitespace.style.minWidth = '1px';
  confirmELBodyWhitespace.style.flex = '0 0 auto';
  confirmELBodyWhitespace.style.height = '20px';

  //Button stuff
  let confirmELButtonsDiv = document.createElement('div');
  confirmELButtonsDiv.classList.add('flex-1xMQg5', 'flex-1O1GKY', 'horizontalReverse-2eTKWD', 'horizontalReverse-3tRjY7', 'flex-1O1GKY', 'directionRowReverse-m8IjIq', 'justifyStart-2NDFzi', 'alignStretch-DpGPf3', 'noWrap-3jynv6', 'footer-2gL1pp');

  let confirmELButtonsSubmit = document.createElement('button');
  confirmELButtonsSubmit.type = 'submit';
  confirmELButtonsSubmit.classList.add('button-38aScr', 'lookFilled-1Gx00P', 'colorRed-1TFJan', 'sizeMedium-1AC_Sl', 'grow-q77ONN');

  let confirmELButtonsSubmitDiv = document.createElement('div');
  confirmELButtonsSubmitDiv.classList.add('contents-18-Yxp');
  confirmELButtonsSubmitDiv.textContent = buttonText;

  let confirmELButtonsCancel = document.createElement('button');
  confirmELButtonsCancel.type = 'button';
  confirmELButtonsCancel.classList.add('button-38aScr', 'lookLink-9FtZy-', 'colorPrimary-3b3xI6', 'sizeMedium-1AC_Sl', 'grow-q77ONN');

  let confirmELButtonsCancelDiv = document.createElement('div');
  confirmELButtonsCancelDiv.classList.add('contents-18-Yxp');
  confirmELButtonsCancelDiv.textContent = 'Cancel';

  //Misc
  let confirmELDimBackgroundDiv = document.createElement('div');
  confirmELDimBackgroundDiv.classList.add('backdropWithLayer-3_uhz4');
  confirmELDimBackgroundDiv.style.opacity = '0.85';
  confirmELDimBackgroundDiv.style.backgroundColor = 'rgb(0, 0, 0)';
  confirmELDimBackgroundDiv.style.transform = 'translateZ(0px)';

  //Add all the elements to the document
  //Appending misc
  confirmELContainer.appendChild(confirmELDimBackgroundDiv);

  //Appending root elements
  confirmELContainer.appendChild(confirmELLayer);
  confirmELLayer.appendChild(confirmEL);
  confirmEL.appendChild(confirmELRoot);

  //Appending headers
  confirmELRoot.appendChild(confirmELHeaderDiv);
  confirmELHeaderDiv.appendChild(confirmElHeaderH);

  //Appending body
  confirmELRoot.appendChild(confirmELBody);
  confirmELBody.appendChild(confirmELBodyText);
  confirmELBody.appendChild(confirmELBodyWhitespace);

  //Appending buttons
  confirmELRoot.appendChild(confirmELButtonsDiv);

  confirmELButtonsDiv.appendChild(confirmELButtonsSubmit);
  confirmELButtonsDiv.appendChild(confirmELButtonsCancel);
  confirmELButtonsSubmit.appendChild(confirmELButtonsSubmitDiv);
  confirmELButtonsCancel.appendChild(confirmELButtonsCancelDiv);

  //Inserting element into document
  document.getElementById('app-mount').insertBefore(confirmELContainer, null);

  //Making it function
  confirmELButtonsSubmit.onclick = () => {
    confirmELLayer.remove();
    confirmELDimBackgroundDiv.remove();

    res(true);
  };

  confirmELButtonsCancel.onclick = () => {
    confirmELLayer.remove();
    confirmELDimBackgroundDiv.remove();

    res(false);
  };

  confirmELDimBackgroundDiv.onclick = () => {
    confirmELLayer.remove();
    confirmELDimBackgroundDiv.remove();
  };

  /*document.querySelector('div[aria-label="Close"]').onclick = () => {
    confirmELLayer.remove();
    confirmELDimBackgroundDiv.remove();
  };*/
  });
}