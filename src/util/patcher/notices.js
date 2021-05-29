import * as PatcherBase from './base';

import { getOwnerInstance } from '../react';
import sleep from '../sleep';

export let notices = [];

let goosemodScope = {};

let updateCall;

export const setThisScope = async (scope) => {
  goosemodScope = scope;

  const BaseClasses = goosemodScope.webpackModules.findByProps('base', 'sidebar');

  while (document.getElementsByClassName(BaseClasses.base)[0] === undefined) {
    await sleep(10);
  }
  
  const baseOwnerInstance = getOwnerInstance(document.getElementsByClassName(BaseClasses.base)[0]);

  const { React } = goosemodScope.webpackModules.common;

  class NoticeContainer extends React.PureComponent {
    constructor (props) {
      super(props);


      this._updateCall = () => this.forceUpdate();
    }
  
    componentDidMount () {
      updateCall = this._updateCall;
    }
  
    componentWillUnmount () {
    }
  
    render () {
      return notices.length > 0 ? notices.shift().react : null;
    }
  }

  PatcherBase.patch(baseOwnerInstance.props.children, 'type', (_args, ret) => {
    ret.props.children[1].props.children.props.children.unshift(React.createElement(NoticeContainer));

    return ret;
  });

  baseOwnerInstance.forceUpdate();
};


export const patch = (content, buttonText, clickHandler, colorKey = 'brand') => {
  const NoticeColors = goosemodScope.webpackModules.findByProps('colorDanger', 'notice');
  const color = NoticeColors[`color${colorKey[0].toUpperCase() + colorKey.substring(1).toLowerCase()}`];

  const Notice = goosemodScope.webpackModules.findByProps('NoticeCloseButton', 'NoticeButton');

  const { React } = goosemodScope.webpackModules.common;

  const id = PatcherBase.generateId();

  const el = React.createElement(Notice.default, {
      class: 'goosemod-notice',
      id,
      color
    },

    React.createElement(Notice.NoticeCloseButton, {
      onClick: () => {
        notices = notices.filter((x) => x.id !== id);

        updateCall();
      }
    }),

    content,

    React.createElement(Notice.NoticeButton, {
      onClick: () => {
        clickHandler();
      }
    }, buttonText)
  );

  notices.push({
    react: el,
    id
  });

  updateCall();
};