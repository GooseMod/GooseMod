import * as PatcherBase from './base';
import { findInReactTree } from '../react';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const patch = (tooltipText, imgSrc, clickHandler, { inUpload = false, inReadonlyChannels = false } = {}) => {
  const { React } = goosemodScope.webpackModules.common;
  const Tooltip = goosemodScope.webpackModules.findByDisplayName('Tooltip');
  const Button = goosemodScope.webpackModules.findByProps('Looks', 'DropdownSizes');

  const buttonClasses = goosemodScope.webpackModules.findByProps('button');
  const buttonWrapperClasses = goosemodScope.webpackModules.findByProps('buttonWrapper', 'pulseButton');
  const buttonTextAreaClasses = goosemodScope.webpackModules.findByProps('button', 'textArea');

  const ChannelTextAreaContainer = goosemodScope.webpackModules.find(m => m.type && m.type.render && m.type.render.displayName === 'ChannelTextAreaContainer');

  return PatcherBase.patch(ChannelTextAreaContainer.type, 'render', (_args, res) => {
    const props = findInReactTree(res, (r) => r && r.className && r.className.indexOf("buttons-") === 0);
    if (!props ||
      (!inUpload && res.props.children[0].ref.current?.classList?.contains('channelTextAreaUpload-3t7EIx') === true) ||
      (!inReadonlyChannels && res.props.children[0].ref.current?.classList?.contains('channelTextAreaDisabled-8rmlrp') === true)) return res;

    props.children.unshift(
      React.createElement('div', null,
        React.createElement(Tooltip, {
          position: "top",
          text: tooltipText
        }, ({
          onMouseLeave,
          onMouseEnter
        }) =>
          React.createElement(Button, {
            look: Button.Looks.BLANK,
            size: Button.Sizes.ICON,
            onClick: () => {
              clickHandler(props);
            },
            onMouseEnter,
            onMouseLeave
          },
            typeof imgSrc !== 'string' ? imgSrc : React.createElement("img", {
              src: imgSrc,
              width: "24px",
              height: "24px",
              className: `${buttonTextAreaClasses.button} ${buttonClasses.contents} ${buttonWrapperClasses.button}`
            })
          )
        )
      )
    );

    return res;
  });
};