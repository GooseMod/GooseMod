(function () {
  'use strict';

  var sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Color utils (from GEx1)
  const fromStr = (str) => str.replace('rgb(', '').replace(')', '').split(', ');
  const toStr = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;

  const light = (str, val) => toStr(fromStr(str).map((x) => x * val));


  const gmColor = '88, 101, 242'; // New blurple
  const regionColor = '114, 137, 218'; // Old blurple

  const makeRegionStyle = (color) => `background-color: rgb(${color}); color: white; border-radius: 4px; border: 2px solid ${light(color, 0.5)}; padding: 3px 6px 3px 6px; font-weight: bold;`;


  const debug = (_region, ...args) => {
    const regions = _region.split('.');

    const regionStrings = regions.map(x => `%c${x}%c`);
    const regionStyling = regions.reduce((res) => 
      res.concat(makeRegionStyle(regionColor), '')
    , []);

    console.log(`%cGooseMod%c ${regionStrings.join(' ')}`,
      makeRegionStyle(gmColor),
      '',

      ...regionStyling,
      
      ...args
    );
  };

  var Logger = {
    __proto__: null,
    debug: debug
  };

  let wpRequire;

  wpRequire = window.webpackJsonp.push([[], { get_require: (mod, _exports, wpRequire) => mod.exports = wpRequire }, [["get_require"]]]); // Get Webpack's require via injecting into webpackJsonp

  // Remove module injected
  delete wpRequire.m.get_require;
  delete wpRequire.c.get_require;


  const all = () => Object.keys(wpRequire.c).map((x) => wpRequire.c[x].exports).filter((x) => x); // Get all modules

  const find = (filter) => { // Generic find utility
    for (const m of all()) {
      if (m.default && filter(m.default)) return m.default;
      if (filter(m)) return m;
    }
  };

  const findAll = (filter) => { // Find but return all matches, not just first
    const out = [];

    for (const m of all()) {
      if (m.default && filter(m.default)) out.push(m.default);
      if (filter(m)) out.push(m);
    }

    return out;
  };

  const findByProps = (...props) => find((m) => props.every((x) => m[x] !== undefined)); // Find by props in module
  const findByPropsAll = (...props) => findAll((m) => props.every((x) => m[x] !== undefined)); // Find by props but return all matches

  const findByPrototypes = (...protos) => find((m) => m.prototype && protos.every((x) => m.prototype[x] !== undefined)); // Like find by props but prototype

  const findByDisplayName = (name) => find((m) => m.displayName === name); // Find by displayName


  const common = { // Common modules
    React: findByProps('createElement'),
    ReactDOM: findByProps('render', 'hydrate'),
    
    Flux: findByProps('Store', 'CachedStore', 'PersistedStore'),
    FluxDispatcher: findByProps('_waitQueue', '_orderedActionHandlers'),

    i18n: findByProps('Messages', '_requestedLocale'),

    channels: findByProps('getSelectedChannelState', 'getChannelId'),
    constants: findByProps('API_HOST', 'CaptchaTypes')
  };

  var WebpackModules = {
    __proto__: null,
    all: all,
    find: find,
    findAll: findAll,
    findByProps: findByProps,
    findByPropsAll: findByPropsAll,
    findByPrototypes: findByPrototypes,
    findByDisplayName: findByDisplayName,
    common: common
  };

  var _GMErrorBoundary = () => {
  const { React } = goosemod.webpackModules.common;

  const Header = goosemod.webpackModules.findByDisplayName('Header');
  const Button = goosemod.webpackModules.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');

  const Markdown = goosemod.webpackModules.findByDisplayName('Markdown');

  const DropdownArrow = goosemod.webpackModules.findByDisplayName('DropdownArrow');

  return class GMErrorBoundary extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        error: false
      };
    }

    componentDidCatch(error, moreInfo) {
      console.log('honk', {error, moreInfo});

      const errorStack = decodeURI(error.stack.split('\n').filter((x) => !x.includes('/assets/')).join('\n'));
      const componentStack = decodeURI(moreInfo.componentStack.split('\n').slice(1, 9).join('\n'));

      const suspectedPlugin = errorStack.match(/\((.*) \| GM Module:/)?.[1] || componentStack.match(/\((.*) \| GM Module:/)?.[1];
      const suspectedName = suspectedPlugin || ((errorStack.includes('GooseMod') || componentStack.includes('GooseMod')) ? 'GooseMod Internals' : 'Unknown');
      const suspectedType = suspectedPlugin ? 'Plugin' : 'Cause';

      this.setState({
        error: true,

        suspectedCause: {
          name: suspectedName,
          type: suspectedType
        },

        errorStack: {
          raw: error.stack,
          useful: errorStack
        },

        componentStack: {
          raw: moreInfo.componentStack,
          useful: componentStack
        }
      });
    }

    render() {
      if (this.state.toRetry) {
        this.state.error = false;
      }

      setTimeout(() => {
        this.state.toRetry = true;
      }, 100);

      return this.state.error ? React.createElement('div', {
        className: 'gm-error-boundary'
      },
        React.createElement('div', {},
          React.createElement('div', {}),
    
          React.createElement(Header, {
            size: Header.Sizes.SIZE_24,
          },  'GooseMod has handled an error',
            React.createElement(Markdown, {}, `## Suspected ${this.state.suspectedCause.type}: ${this.state.suspectedCause.name}`)
          )
        ),
    
        React.createElement('div', {},
          React.createElement(Button, {
            color: Button.Colors.RED,
            size: Button.Sizes.LARGE,
    
            onClick: () => {
              location.reload();
            }
          }, 'Refresh')
        ),

        React.createElement('div', {
          onClick: () => {
            this.state.toRetry = false;

            this.state.showDetails = !this.state.showDetails;
            this.forceUpdate();
          }
        },
          React.createElement('div', {
            style: {
              transform: `rotate(${this.state.showDetails ? '0' : '-90'}deg)`
            },
          },
            React.createElement(DropdownArrow, {
              width: 24,
              height: 24
            })
          ),

          this.state.showDetails ? 'Hide Details' : 'Show Details'
        ),

        this.state.showDetails ? React.createElement('div', {},
          React.createElement(Markdown, {}, `# Error Stack`),
          React.createElement(Markdown, {}, `\`\`\`
${this.state.errorStack.useful}
\`\`\``),
          React.createElement(Markdown, {}, `# Component Stack`),
          React.createElement(Markdown, {}, `\`\`\`
${this.state.componentStack.useful}
\`\`\``)
        ) : null
      ) : this.props.children;
    }
  }
  };

  let GMErrorBoundary;

  const generateIdSegment = () => Math.random().toString(16).substring(2); // Random 13 char hex string

  const generateId = (segments = 3) => new Array(segments).fill(0).map(() => generateIdSegment()).join(''); // Chain random ID segments

  const modIndex = {};

  const isReactComponent = (component) => {
    return !!(component && (
      component.prototype?.render || component.displayName
    ));
  };


  const beforePatches = (context, args, id, functionName, keyName) => {
    const patches = modIndex[id][keyName].before;

    if (patches.length === 0) return args;

    let newArgs = args;

    for (const patch of patches) {
      try {
        let toSetNewArgs = patch.call(context, newArgs);

        if (toSetNewArgs === false) return false;

        if (Array.isArray(toSetNewArgs)) {
          newArgs = args;
        }
      } catch (e) {
        console.error(`Before patch (${id} - ${functionName}) failed, skipping`, e);
      }
    }

    return newArgs;
  };

  const afterPatches = (context, newArgs, returnValue, id, functionName, keyName) => {
    const patches = modIndex[id][keyName].after;
    
    let newReturnValue = returnValue;

    for (const patch of patches) {
      try {
        let toSetReturnValue = patch.call(context, newArgs, newReturnValue);

        if (toSetReturnValue) {
          newReturnValue = toSetReturnValue;
        }
      } catch (e) {
        console.error(`After patch (${id} - ${functionName}) failed, skipping`, e);
      }
    }
    
    return newReturnValue;
  };

  const generateNewFunction = (originalFunction, id, functionName, keyName) => (function (...args) {
    const newArgs = beforePatches(this, args, id, functionName, keyName);

    let toReturn;

    if (Array.isArray(newArgs)) {
      const returnValue = originalFunction.call(this, ...newArgs);

      toReturn = afterPatches(this, newArgs, returnValue, id, functionName, keyName);
    }

    const { harden } = modIndex[id][keyName];

    if (harden) {
      if (!GMErrorBoundary) GMErrorBoundary = _GMErrorBoundary();
      const { React } = goosemod.webpackModules.common;

      return React.createElement(GMErrorBoundary, {}, toReturn);
    }

    return toReturn;
  });

  const patch$a = (parent, functionName, handler, before = false) => {
    if (!parent._goosemodPatcherId) {
      const id = generateId();

      parent._goosemodPatcherId = id;

      modIndex[id] = {};
    }

    const id = parent._goosemodPatcherId;
    const keyName = `gm-${functionName}`;

    if (!modIndex[id][keyName]) {
      const originalFunctionClone = Object.assign({}, parent)[functionName];

      parent[functionName] = Object.assign(generateNewFunction(parent[functionName], id, functionName, keyName), originalFunctionClone);

      parent[functionName].toString = () => originalFunctionClone.toString(); // You cannot just set directly a.toString = b.toString like we used to because strange internal JS prototype things, so make a new function just to run original function

      let toHarden = false;
      if (isReactComponent(parent[functionName])) toHarden = true;
      if (parent.render) {
        if (functionName !== 'render') {
          patch$a(parent, 'render', () => {}); // Noop patch in component render to force harden
        } else {
          toHarden = true;
        }
      }

      modIndex[id][keyName] = {
        before: [],
        after: [],

        harden: toHarden
      };
    }

    const newLength = modIndex[id][keyName][before ? 'before' : 'after'].push(handler);

    return () => { // Unpatch function
      modIndex[id][keyName][before ? 'before' : 'after'].splice(newLength - 1, 1);
    };
  };

  // DEPRECATED: Compatibility functions for modules from older (<5.8.0) GooseMod versions
  const uninjectors$1 = {};

  const inject = (_id, parent, functionName, handler, before = false) => {
    uninjectors$1[_id] = patch$a(parent, functionName, handler, before);
  };

  const uninject = (_id) => {
    if (!uninjectors$1[_id]) return false;

    uninjectors$1[_id]();

    return true;
  };

  const getReactInstance = (el) => el && el[Object.keys(el).find((x) => // Get React node from HTML element via internal key
    x.startsWith('__reactInternalInstance') || // Old React
    x.startsWith('__reactFiber$') // New React (in Canary since ~22/07/21)
  )];

  const getNodeInternals = (node) => node &&
    node._reactInternalFiber || // Old React
    node._reactInternals; // New React (in Canary since ~22/07/21)

  const getOwnerInstance = (node) => { // Go through React node's parent until one is a React node (not null or HTML element)
    let inst = getReactInstance(node);

    while (inst.return) { // Whilst we can still go through parents
      inst = inst.return; // Go up to next parent

      if (inst.stateNode?._reactInternals) return inst.stateNode; // If React node, return
    }
  };

  const findInTree = (parent, filter, opts) => { // Find in tree utility function - parameters supported like BD's + PC's APIs to maintain compatibility
    const { walkable = null, ignore = [] } = opts;

    if (!parent || typeof parent !== 'object') { // Parent is invalid to search through
      return null;
    }

    if (typeof filter === 'string') { // Finding key in object
      return parent[filter];
    }
    
    if (filter(parent)) return parent; // Parent matches, just return

    if (Array.isArray(parent)) { // Parent is an array, go through values
      return parent.map((x) => findInTree(x, filter, opts)).find((x) => x);
    }

    // Parent is an object, go through values (or option to only use certain keys)
    return (walkable || Object.keys(parent)).map((x) => !ignore.includes(x) && findInTree(parent[x], filter, opts)).find((x) => x);
  };

  const findInReactTree = (node, filter) => findInTree(node, filter, { // Specialised findInTree for React nodes
    walkable: [ 'props', 'children', 'child', 'sibling' ]
  });

  var ReactUtils = {
    __proto__: null,
    getReactInstance: getReactInstance,
    getNodeInternals: getNodeInternals,
    getOwnerInstance: getOwnerInstance,
    findInTree: findInTree,
    findInReactTree: findInReactTree
  };

  let goosemodScope$o = {};

  const setThisScope$p = (scope) => {
    goosemodScope$o = scope;
  };

  const labelToId = (label) => label.toLowerCase().replace(/ /g, '-');

  const getInjectId = (id) => `gm-cm-${id}`;

  const patchTypeToNavId = (type) => {
    switch (type) {
      case 'user':
        return 'user-context';
      
      case 'message':
        return 'message';

      default:
        return type;
    }
  };

  const getExtraInfo = (navId) => {
    try {
      switch (navId) {
        case 'message':
          return getNodeInternals(getOwnerInstance(document.getElementById('message'))).return.return.memoizedProps;
      
        case 'message-actions':
          return getNodeInternals(getOwnerInstance(document.getElementById('message-actions'))).return.return.memoizedProps;

        case 'user-context':
          return getNodeInternals(getOwnerInstance(document.getElementById('user-context'))).return.return.return.return.return.return.memoizedProps;

        default:
          return undefined;
      }
    } catch (e) { return undefined; }
  };

  const generateElement = (itemProps, _subItems, wantedNavId, type, extraInfo, { Menu, React }) => {
    const isCheckbox = itemProps.checked !== undefined;

    itemProps.id = itemProps.id || labelToId(itemProps.label);

    let subItems = _subItems;
    if (typeof subItems === 'function') subItems = subItems();

    if (subItems) subItems = subItems.map((x) => {
      if (!x.originalAction) x.originalAction = x.action;

      return x;
    });

    itemProps.action = function() {
      if (isCheckbox) {
        itemProps.checked = !itemProps.checked;
        item.props.checked = itemProps.checked; // Update the actual current item's props too

        getOwnerInstance(document.getElementById(`${wantedNavId}-${itemProps.id}`)).props.onMouseEnter(); // And make it re-render

        return itemProps.originalAction(arguments, extraInfo, itemProps.checked);
      }

      return itemProps.originalAction(arguments, extraInfo);
    };

    const component = isCheckbox ? Menu.MenuCheckboxItem : Menu.MenuItem;
    const item = subItems !== undefined ? React.createElement(component, itemProps, ...subItems.map((x) => generateElement(x, x.sub, wantedNavId, type, extraInfo, { Menu, React }))) : React.createElement(component, itemProps);

    return item;
  };

  const patch$9 = (type, itemProps) => {
    const { React } = goosemodScope$o.webpackModules.common;
    const Menu = goosemodScope$o.webpackModules.findByProps('MenuItem');

    const wantedNavId = patchTypeToNavId(type);

    itemProps.originalAction = itemProps.action;

    return patch$a(Menu, 'default', (args) => {
      const [ { navId, children } ] = args;

      if (navId !== wantedNavId &&
        !(wantedNavId === 'message' && navId === 'message-actions') // Special case: expanded MiniPopover menu
      ) {
        return args;
      }

      const alreadyHasItem = findInReactTree(children, child => child && child.props && child.props.id === (itemProps.id || labelToId(itemProps.label)));
      if (alreadyHasItem) return args;

      const clonedProps = Object.assign({}, itemProps);

      const item = generateElement(clonedProps, clonedProps.sub, wantedNavId, type, Object.assign({}, getExtraInfo(navId)), { Menu, React });
    
      let goosemodGroup = findInReactTree(children, child => child && child.props && child.props.goosemod === true);

      if (!goosemodGroup) {
        goosemodGroup = React.createElement(Menu.MenuGroup, { goosemod: true }, item);

        children.push([ React.createElement(Menu.MenuSeparator), goosemodGroup ]);
      } else {
        if (!Array.isArray(goosemodGroup.props.children)) {
          goosemodGroup.props.children = [ goosemodGroup.props.children ];
        }
      
        goosemodGroup.props.children.push(item);
      }
      
      return args;
    }, true);
  };


  // DEPRECATED: Compatibility functions for modules from older (<5.8.0) GooseMod versions
  const uninjectors = {};

  const add$1 = (type, itemProps) => {
    uninjectors[getInjectId(itemProps.id || labelToId(itemProps.label))] = patch$9(type, itemProps);
  };

  const remove$3 = (label) => {
    const id = getInjectId(labelToId(label));

    if (!uninjectors[id]) return false;

    uninjectors[id]();

    return true;
  };

  var _contextMenu = {
    __proto__: null,
    setThisScope: setThisScope$p,
    labelToId: labelToId,
    getInjectId: getInjectId,
    patchTypeToNavId: patchTypeToNavId,
    getExtraInfo: getExtraInfo,
    patch: patch$9,
    add: add$1,
    remove: remove$3
  };

  let goosemodScope$n = {};

  const setThisScope$o = (scope) => {
    goosemodScope$n = scope;
  };

  const patch$8 = (tooltipText, imgSrc, clickHandler) => {
    const { React } = goosemodScope$n.webpackModules.common;
    const Tooltip = goosemodScope$n.webpackModules.findByDisplayName('Tooltip');
    const { icon: iconClass } = goosemodScope$n.webpackModules.findByProps('icon', 'isHeader');
    
    const MiniPopover = goosemodScope$n.webpackModules.find((m) => m.default && m.default.displayName === 'MiniPopover');
    
    return patch$a(MiniPopover, 'default', (_args, res) => {
      const props = findInReactTree(res, (r) => r && r.message);
      if (!props) return res;

      res.props.children.unshift(
        React.createElement(Tooltip, {
          position: "top",
          text: tooltipText
        }, ({
          onMouseLeave,
          onMouseEnter
        }) =>
          React.createElement(MiniPopover.Button, {
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
              className: iconClass
            })
          )
        )
      );

      return res;
    });
  };

  var _miniPopover = {
    __proto__: null,
    setThisScope: setThisScope$o,
    patch: patch$8
  };

  let goosemodScope$m = {};

  const setThisScope$n = (scope) => {
    goosemodScope$m = scope;
  };

  const patch$7 = (tooltipText, imgSrc, clickHandler, { inUpload = false, inReadonlyChannels = false } = {}) => {
    const { React } = goosemodScope$m.webpackModules.common;
    const Tooltip = goosemodScope$m.webpackModules.findByDisplayName('Tooltip');
    const Button = goosemodScope$m.webpackModules.findByProps('Looks', 'DropdownSizes');

    const buttonClasses = goosemodScope$m.webpackModules.findByProps('button');
    const buttonWrapperClasses = goosemodScope$m.webpackModules.findByProps('buttonWrapper', 'pulseButton');
    const buttonTextAreaClasses = goosemodScope$m.webpackModules.findByProps('button', 'textArea');

    const ChannelTextAreaContainer = goosemodScope$m.webpackModules.find(m => m.type && m.type.render && m.type.render.displayName === 'ChannelTextAreaContainer');

    return patch$a(ChannelTextAreaContainer.type, 'render', (_args, res) => {
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

  var _channelTextAreaButtons = {
    __proto__: null,
    setThisScope: setThisScope$n,
    patch: patch$7
  };

  let goosemodScope$l = {};
  let Commands;

  const setThisScope$m = (scope) => {
    goosemodScope$l = scope;

    Commands = goosemodScope$l.webpackModules.findByProps('BUILT_IN_COMMANDS', 'BUILT_IN_SECTIONS');
    const Hook = goosemodScope$l.webpackModules.findByProps('useApplicationCommandsDiscoveryState');

    goosemodScope$l.patcher.patch(Hook, 'useApplicationCommandsDiscoveryState', (_, res) => {
      if (res.applicationCommandSections.find((x) => x.id === applicationId)) return; // Don't add if already added

      const gmCommands = res.commands.filter((x, i) => x.applicationId === applicationId && res.commands.indexOf(x) === i);
      const gmSection = Commands.BUILT_IN_SECTIONS[applicationId];

      res.discoveryCommands.push(...gmCommands);
      res.discoverySections.push({
        data: gmCommands,
        section: gmSection,
        key: applicationId
      });

      res.applicationCommandSections.push(gmSection);
      
      return res;
    });
  };

  const applicationId = '827187782140428288';

  const addSection = (obj) => Commands.BUILT_IN_SECTIONS[obj.id] = obj;
  const removeSection = (id) => delete Commands.BUILT_IN_COMMANDS[id];
  const hasSection = (id) => !!Commands.BUILT_IN_SECTIONS[id];

  const add = (name, description, execute, options = []) => {
    const mod = Commands;

    if (!hasSection(applicationId)) { // If no GooseMod section, create it
      addSection({
        id: applicationId,
        icon: '7f274cc3c1216505238ce047ce6e35e9', // Avatar file name for application

        name: 'GooseMod',
        type: 1
      });
    }

    mod.BUILT_IN_COMMANDS.push({
      applicationId: applicationId,

      type: 0,
      target: 1,

      description,
      name,
      execute,
      options,

      id: `-${Math.random().toString().split('.')[1].substring(0, 5)}` // Randomly generate ID
    });
  };

  const remove$2 = (name) => {
    const mod = Commands;

    mod.BUILT_IN_COMMANDS = mod.BUILT_IN_COMMANDS.filter(x => x.name !== name); // Filter out commands with given name

    const gmCommands = mod.BUILT_IN_COMMANDS.filter(x => x.applicationId === applicationId); // Find GooseMod commands via applicationId

    if (gmCommands.length === 0) { // If there is currently no GooseMod commands, remove the section
      removeSection(applicationId);
    }
  };

  var _commands = {
    __proto__: null,
    setThisScope: setThisScope$m,
    add: add,
    remove: remove$2
  };

  let goosemodScope$k = {};

  const setThisScope$l = (scope) => {
    goosemodScope$k = scope;

    const { BOT_AVATARS } = goosemodScope$k.webpackModules.findByProps('BOT_AVATARS', 'DEFAULT_AVATARS');

    BOT_AVATARS.GooseMod = 'https://cdn.discordapp.com/avatars/760559484342501406/5125aff2f446ad7c45cf2dfd6abf92ed.webp'; // Add avatar image
  };


  const send = (content, author = 'GooseMod') => {
    // Get Webpack Modules
    const { createBotMessage } = goosemodScope$k.webpackModules.findByProps('createBotMessage');
    const { getChannelId } = goosemodScope$k.webpackModules.findByProps('getChannelId');
    const { receiveMessage } = goosemodScope$k.webpackModules.findByProps('receiveMessage', 'sendBotMessage');

    const msg = createBotMessage(getChannelId(), '');

    if (typeof content === 'string') {
      msg.content = content;
    } else {
      msg.embeds.push(content);
    }

    msg.state = 'SENT'; // Set Clyde-like props
    msg.author.id = '1';
    msg.author.bot = true;
    msg.author.discriminator = '0000';

    msg.author.avatar = 'GooseMod'; // Allow custom avatar URLs in future? (via dynamic BOT_AVATARS adding)
    msg.author.username = author;

    receiveMessage(getChannelId(), msg);
  };

  let notices$1 = [];

  let goosemodScope$j = {};

  let updateCall;

  const setThisScope$k = async (scope) => {
    goosemodScope$j = scope;

    const BaseClasses = goosemodScope$j.webpackModules.findByProps('base', 'sidebar');

    while (document.getElementsByClassName(BaseClasses.base)[0] === undefined) {
      await sleep(10);
    }
    
    const baseOwnerInstance = getOwnerInstance(document.getElementsByClassName(BaseClasses.base)[0]);

    const { React } = goosemodScope$j.webpackModules.common;

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
        return notices$1.length > 0 ? notices$1.shift().react : null;
      }
    }

    patch$a(baseOwnerInstance.props.children, 'type', (_args, ret) => {
      ret.props.children[1].props.children.props.children.unshift(React.createElement(NoticeContainer));

      return ret;
    });

    baseOwnerInstance.forceUpdate();
  };


  const patch$6 = (content, buttonText, clickHandler, colorKey = 'brand') => {
    const NoticeColors = goosemodScope$j.webpackModules.findByProps('colorDanger', 'notice');
    const color = NoticeColors[`color${colorKey[0].toUpperCase() + colorKey.substring(1).toLowerCase()}`];

    const Notice = goosemodScope$j.webpackModules.findByProps('NoticeCloseButton', 'NoticeButton');

    const { React } = goosemodScope$j.webpackModules.common;

    const id = generateId();

    const el = React.createElement(Notice.default, {
        class: 'goosemod-notice',
        id,
        color
      },

      React.createElement(Notice.NoticeCloseButton, {
        onClick: () => {
          notices$1 = notices$1.filter((x) => x.id !== id);

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

    notices$1.push({
      react: el,
      id
    });

    updateCall();
  };

  var _notices = {
    __proto__: null,
    get notices () { return notices$1; },
    setThisScope: setThisScope$k,
    patch: patch$6
  };

  let goosemodScope$i = {};

  const setThisScope$j = (scope) => {
    goosemodScope$i = scope;
  };

  const patch$5 = (tooltipText, imgSrc, clickHandler, { atEnd = false, showWhere = [ 'dm', 'channel' ] } = {}) => {
    const { React } = goosemodScope$i.webpackModules.common;

    const headerClasses = goosemod.webpackModules.findByProps('title', 'themed', 'icon', 'icon', 'iconBadge');

    const HeaderBar = goosemodScope$i.webpackModules.find((x) => x.default && x.default.displayName === 'HeaderBar');

    return patch$a(HeaderBar, 'default', (_args, res) => {
      const buttons = res.props.children.props.children[1].props.children.props.children;

      let currentWhere = 'other';

      if (buttons[1] === null) {
        currentWhere = 'home';
      } else switch (buttons[0][1].key) {
        case 'mute': {
          currentWhere = 'channel';
          break;
        }
        
        case 'calls': {
          currentWhere = 'dm';
          break;
        }
      }

      if (!showWhere.includes(currentWhere)) return res;
    
      buttons[atEnd ? 'push' : 'unshift'](
        React.createElement(HeaderBar.Icon, {
          'aria-label': tooltipText,
          tooltip: tooltipText,

          disabled: false,
          showBadge: false,
          selected: false,

          icon: () => (typeof imgSrc !== 'string' ? imgSrc : React.createElement("img", {
            src: imgSrc,
            width: "24px",
            height: "24px",
            className: `${headerClasses}.icon`
          })),
          onClick: () => {
            clickHandler();
          }
        })
      );

      return res;
    });
  };

  var _headerBarButtons = {
    __proto__: null,
    setThisScope: setThisScope$j,
    patch: patch$5
  };

  let goosemodScope$h = {};

  const setThisScope$i = (scope) => {
    goosemodScope$h = scope;
  };

  const patch$4 = (name, imgUrl, forIds, clickHandler = (() => {}), { round = false } = {}) => {
    const { React } = goosemodScope$h.webpackModules.common;

    const Tooltip = goosemodScope$h.webpackModules.findByDisplayName('Tooltip');
    const Clickable = goosemodScope$h.webpackModules.findByDisplayName('Clickable');

    const BadgeClasses = goosemodScope$h.webpackModules.findByProps('profileBadge24', 'profileBadge22');

    const UserProfileBadgeList = goosemodScope$h.webpackModules.find((m) => m.default && m.default.displayName === 'UserProfileBadgeList');
    
    return patch$a(UserProfileBadgeList, 'default', ([ { user, size } ], res) => {
      if (!forIds().includes(user.id)) return res;

      let sizeClass = BadgeClasses.profileBadge24;

      switch (size) {
        case 1: { // User modal
          sizeClass = BadgeClasses.profileBadge22;
          break;
        }

        case 2: { // User popout
          sizeClass = BadgeClasses.profileBadge18;
          break;
        }
      }

      res.props.children.unshift(
        React.createElement(Tooltip, {
          position: "top",
          text: name
        }, ({
          onMouseLeave,
          onMouseEnter
        }) =>
          React.createElement(Clickable, {
            onClick: () => {
              clickHandler();
            },
            onMouseEnter,
            onMouseLeave
          },
            React.createElement('div', {
              style: {
                backgroundImage: `url("${imgUrl}")`,
                borderRadius: round ? '50%' : ''
              },
              className: `${BadgeClasses.profileBadge} ${sizeClass}`
            })
          )
        )
      );

      return res;
    });
  };

  var _userBadges = {
    __proto__: null,
    setThisScope: setThisScope$i,
    patch: patch$4
  };

  let goosemodScope$g = {};

  const setThisScope$h = (scope) => {
    goosemodScope$g = scope;
  };

  const patch$3 = (generateElement) => {
    const MessageHeader = goosemodScope$g.webpackModules.find((x) => x.default && !x.default.displayName && x.default.toString().indexOf('headerText') > -1);

    return patch$a(MessageHeader, 'default', (_args, res) => {
      const header = goosemod.reactUtils.findInReactTree(res, el => Array.isArray(el?.props?.children) && el.props.children.find(c => c?.props?.message));

      header.props.children.push(generateElement(header.props.children[0].props));

      return res;
    });
  };

  var _username = {
    __proto__: null,
    setThisScope: setThisScope$h,
    patch: patch$3
  };

  let goosemodScope$f = {};

  const setThisScope$g = (scope) => {
    goosemodScope$f = scope;
  };

  const patch$2 = (name, imgUrl, forIds, clickHandler = (() => {}), { round = false } = {}) => {
    const { React } = goosemodScope$f.webpackModules.common;

    const Tooltip = goosemodScope$f.webpackModules.findByDisplayName('Tooltip');
    const Clickable = goosemodScope$f.webpackModules.findByDisplayName('Clickable');

    const BadgeClasses = goosemodScope$f.webpackModules.findByProps('guildIconContainer');

    const GuildHeader = goosemodScope$f.webpackModules.findByDisplayName('GuildHeader');
    
    return patch$a(GuildHeader.prototype, 'renderHeader', function (_args, res) {
      if (!forIds().includes(this.props.guild?.id)) return res;

      res.props.children.unshift(
        React.createElement(Tooltip, {
          position: "top",
          text: name
        }, ({
          onMouseLeave,
          onMouseEnter
        }) =>
          React.createElement(Clickable, {
            onClick: () => {
              clickHandler();
            },
            onMouseEnter,
            onMouseLeave
          },
            React.createElement('div', {
              style: {
                backgroundImage: `url("${imgUrl}")`,
                borderRadius: round ? '50%' : '',

                width: '16px',
                height: '16px',

                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: '50%',
                objectFit: 'cover'
              },
              className: `${BadgeClasses.guildIconContainer}`
            })
          )
        )
      );

      return res;
    });
  };

  var _guildBadges = {
    __proto__: null,
    setThisScope: setThisScope$g,
    patch: patch$2
  };

  const contextMenu = _contextMenu;
  const miniPopover = _miniPopover;
  const channelTextAreaButtons = _channelTextAreaButtons;
  const commands = _commands;
  const internalMessage = send;
  const notices = _notices;
  const headerBarButtons = _headerBarButtons;
  const userBadges = _userBadges;
  const username = _username;
  const guildBadges = _guildBadges;

  const setThisScope$f = (scope) => {
    setThisScope$p(scope);
    setThisScope$o(scope);
    setThisScope$n(scope);
    setThisScope$m(scope);
    setThisScope$l(scope);
    setThisScope$k(scope);
    setThisScope$j(scope);
    setThisScope$i(scope);
    setThisScope$h(scope);
    setThisScope$g(scope);
  };

  var Patcher = {
    __proto__: null,
    contextMenu: contextMenu,
    miniPopover: miniPopover,
    channelTextAreaButtons: channelTextAreaButtons,
    commands: commands,
    internalMessage: internalMessage,
    notices: notices,
    headerBarButtons: headerBarButtons,
    userBadges: userBadges,
    username: username,
    guildBadges: guildBadges,
    setThisScope: setThisScope$f,
    patch: patch$a,
    inject: inject,
    uninject: uninject
  };

  let goosemodScope$e = {};

  const setThisScope$e = (scope) => {
    goosemodScope$e = scope;
  };

  const patch$1 = () => {
    const { React } = goosemodScope$e.webpackModules.common;

    const Avatar = goosemodScope$e.webpackModules.findByProps('Sizes', 'AnimatedAvatar');

    goosemodScope$e.patcher.patch(Avatar, 'default', ([ { src } ], res) => {
      if (!src.includes('/avatars')) return;

      res.props['data-user-id'] = src.match(/\/avatars\/([0-9]+)\//)[1];

      return res;
    });

    // Patch AnimatedAvatar to force rerender
    goosemodScope$e.patcher.patch(Avatar.AnimatedAvatar, 'type', (_args, res) => {
      return React.createElement(Avatar.default, { ...res.props });
    });
  };

  var _avatar = {
    __proto__: null,
    setThisScope: setThisScope$e,
    patch: patch$1
  };

  const avatar = _avatar;

  const setThisScope$d = (scope) => {
    setThisScope$e(scope);
  };

  const patch = () => {
    patch$1();
  };

  var Attrs = {
    __proto__: null,
    avatar: avatar,
    setThisScope: setThisScope$d,
    patch: patch
  };

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

  var showToast = (text, options = {}) => {
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

  let goosemodScope$d = {};

  const setThisScope$c = (scope) => {
    goosemodScope$d = scope;
  };

  const show$1 = (buttonText, title, description, cancelText = undefined, confirmButtonColor = undefined) => {
    return new Promise((res) => {
      const { React } = goosemodScope$d.webpackModules.common;
      const { findByDisplayName, findByProps } = goosemodScope$d.webpackModules;
      
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

  let goosemodScope$c = {};
  let showHideMod = {};

  let originalChangelog = {};

  const setThisScope$b = (scope) => {
    goosemodScope$c = scope;
    showHideMod = goosemodScope$c.webpackModules.findByProps('showChangeLog');

    const orig = goosemodScope$c.webpackModules.findByProps('changeLog').changeLog;

    originalChangelog = Object.assign({}, orig);
  };


  const showChangelog = () => {
    showHideMod.showChangeLog();
  };

  const hideChangelog = () => {
    showHideMod.hideChangeLog();
  };

  const resetChangelog = () => {
    setChangelog(originalChangelog);
  };

  const setChangelog = (givenObj) => {
    const mod = goosemodScope$c.webpackModules.findByProps('changeLog');

    const obj = {
      template: 'standard',
      revision: 1,
      locale: 'en-us',

      ...givenObj
    };

    for (const key of Object.keys(mod.changeLog)) {
      delete mod.changeLog[key];
    }

    for (const key of Object.keys(obj)) {
      mod.changeLog[key] = obj[key];
    }
  };

  var Changelog = {
    __proto__: null,
    setThisScope: setThisScope$b,
    showChangelog: showChangelog,
    hideChangelog: hideChangelog,
    resetChangelog: resetChangelog,
    setChangelog: setChangelog
  };

  const image = 'https://media.discordapp.net/attachments/756146058924392542/771374562184658944/2018-11-14-11-36-30-1200x800.png';

  let version, generated;

  let goosemodScope$b = {};

  const setThisScope$a = (scope) => {
    goosemodScope$b = scope;
  };

  const show = async () => {
    if (!generated) {
      generate();
    }

    goosemodScope$b.changelog.resetChangelog();

    goosemodScope$b.changelog.setChangelog(generated);

    goosemodScope$b.changelog.showChangelog();

    await sleep(300);

    const customTweaks = () => {
      document.querySelector('.modal-1TF_VN .size20-17Iy80').textContent = `GooseMod ${version}`; // Set changelog modal title

      document.querySelector('.modal-1TF_VN .footer-2gL1pp').remove(); // Remove footer of modal with social media
    };

    customTweaks();

    goosemodScope$b.changelog.resetChangelog();

    // Tweak again since opening it right at beginning of injection / Discord load (eg: GooseMod update) often fails to do after first wait
    setTimeout(customTweaks, 300);
  };

  const generate = () => {
    const changelog = JSON.parse("{\"version\":\"v11.1\",\"date\":\"2021-08-10\",\"body\":\"Store {added marginTop}\\n======================\\n\\n* **Repos modal now has a new header.** Now reports statistics of repos (theme, plugin, and developer count) and matches Discord's new styling.\\n* **Removed toast appearing on module updates.**\\n\\nSettings {added}\\n======================\\n\\n* **Removed GM Storage Impl from settings sidebar.** Also added it to \\\"Copy Debug Info\\\" setting output.\\n\\nTweaks and Fixes {progress}\\n======================\\n\\n* **Fixed Tour crashing.**\\n* **Fixed some plugins failing to save settings.**\\n* **Changed how settings implementation is chosen to use extension variable.**\\n* **Fixed being unable to open Store in Home if no DMs are in sidebar.**\\n* **Fixed Snippets mistakenly appearing if Store in Home is disabled.**\\n* **Fixed Store in settings hiding all plugins and themes.**\\n* **Fixed Store categories sorting being interferred with by sort by dropdown.**\"}");

    version = changelog.version;

    generated = {
      image,

      date: changelog.date,
      body: changelog.body
    };
  };

  var GoosemodChangelog = {
    __proto__: null,
    setThisScope: setThisScope$a,
    show: show,
    generate: generate
  };

  let goosemodScope$a = {};

  const setThisScope$9 = (scope) => {
    goosemodScope$a = scope;
  };

  let themes$1 = [
    'Dracula Theme',
    'Darkest Theme',
    'Solarized Dark Theme',
    //'Slate'
  ];

  let packs = [
    {
      text: 'Minimal',
      subtext: 'A basic installation with no visual changes; only analytics blocking and fixes',
      modules: ['Hardcoded Color Fixer', 'Fucklytics']
    },
    {
      text: 'Recommended',
      subtext: 'The recommended starting experience: a few visual improvements and customisation options',
      modules: ['Visual Tweaks', 'Username In Author', 'Custom Sounds', 'Better Message Deletion', 'Nickname Panel'],
      base: 'Minimal'
    },
    {
      text: 'Complete',
      subtext: 'A large amount of the avaliable modules which overhauls the UI and adds extra features',
      modules: ['WYSIWYG Messages', 'Twitch Emotes', 'RadialStatus', 'Simple Status Icons', 'User Popout Creation Date', 'Clear Recent Games', 'Game Activity Button', 'Macros', 'Role Colored Messages'],
      base: 'Recommended'
    }
  ];

  packs = packs.map((x) => {
    if (x.base) {
      let basePack = packs.find((y) => y.text === x.base);
      x.modules = basePack.modules.concat(...x.modules);
    }

    return x;
  });

  const selectionModal = (title, options) => {
    return new Promise((res) => {
      goosemodScope$a.webpackModules.findByPropsAll('show')[0].show({
        title,
        
        body: 'Body'
      });
      
      let form = [...document.getElementsByClassName('form-26zE04')].pop();

      form.lastChild.remove(); // Remove footer with button
      
      let content = form.firstChild.firstChild;
      
      content.firstChild.style.flex = 'unset'; // Stop title taking up all of contents
      
      content.lastChild.remove(); // Remove body
      
      let container = form.parentElement;
      container.style.maxHeight = 'none';
      // container.style.height = '70vh';
      
      let buttonsContainerEl = document.createElement('div');
      
      buttonsContainerEl.style.display = 'flex';
      buttonsContainerEl.style.flexDirection = 'column';
      buttonsContainerEl.style.justifyContent = 'center';
      buttonsContainerEl.style.flexGrow = '1';
      
      for (let p of options) {
        let el = document.createElement('div');
        el.style.margin = '20px';
        
        el.style.display = 'flex';
        el.style.flexDirection = 'column';
        
        let buttonEl = document.createElement('button');
        buttonEl.classList.add('primaryButton-2BsGPp', 'button-38aScr', 'lookFilled-1Gx00P', 'colorBrand-3pXr91', 'sizeXlarge-2yFAlZ', 'grow-q77ONN');
        
        buttonEl.onclick = () => {
          res(p);
        };

        if (p.onmouseenter) { 
          buttonEl.onmouseenter = () => {
            p.onmouseenter(container);
          };
        }

        if (p.onmouseleave) {
          buttonEl.onmouseleave = () => {
            p.onmouseleave(container);
          };
        }
        
        let contentsEl = document.createElement('div');
        contentsEl.classList.add('contents-18-Yxp');
        
        let displayName = p.text; //p.name[0].toUpperCase() + p.name.substring(1);
        
        contentsEl.textContent = displayName;
        
        buttonEl.appendChild(contentsEl);
        
        buttonEl.style.flex = 'unset';
        
        el.appendChild(buttonEl);
        
        let minorEl = document.createElement('div');
        minorEl.classList.add('minorContainer-Oi4S_y');
        
        minorEl.style.cursor = 'default';
        
        let minorTextEl = document.createElement('div');
        minorTextEl.classList.add('colorStandard-2KCXvj', 'size12-3cLvbJ');
        
        minorTextEl.style.textAlign = 'center';
        minorTextEl.style.opacity = '.6';
        
        minorTextEl.textContent = p.subtext; // `${packs[p].length} modules`; //packs[p].map((x) => goosemodScope.moduleStoreAPI.modules.find((y) => y.filename === x)).map((x) => x.name).join(', ');
        
        minorEl.appendChild(minorTextEl);
        
        el.appendChild(minorEl);
        
        buttonsContainerEl.appendChild(el);
      }
      
      content.appendChild(buttonsContainerEl);
    });
  };

  const installModules = async (modules) => {
    for (let m of modules) {
      goosemodScope$a.updateLoadingScreen(`${goosemodScope$a.moduleStoreAPI.modules.find((x) => x.name === m).name} - ${modules.indexOf(m) + 1}/${modules.length}`);

      await goosemodScope$a.moduleStoreAPI.importModule(m);
    }
  };

  const ask = () => {
    return new Promise(async (res) => {
      goosemodScope$a.stopLoadingScreen();

      let packModules = (await selectionModal('Please pick a pack', packs)).modules;

      goosemodScope$a.startLoadingScreen();

      await installModules(packModules);

      let themesOptions = themes$1.map((x) => {
        let mod = goosemodScope$a.moduleStoreAPI.modules.find((y) => y.name === x);

        // let imported;

        return {
          text: mod.name.replace(' Theme', ''),
          subtext: mod.description,
          actual: x,
          onmouseenter: async function(container) {
            //if (!x.css) return;

            container.style.transition = 'opacity 1s';
            container.style.opacity = '0.2';

            let backdropEl = document.getElementsByClassName('backdrop-1wrmKB')[0];
            backdropEl.style.transition = 'opacity 1s';
            backdropEl.style.opacity = '0';

            await goosemodScope$a.moduleStoreAPI.importModule(mod.name);
          },
          onmouseleave: function(container) {
            container.style.opacity = '1';
            document.getElementsByClassName('backdrop-1wrmKB')[0].style.opacity = '0.85';

            if (!goosemodScope$a.modules[mod.name]) return;

            goosemodScope$a.settings.removeModuleUI(mod.name);
          }
        };
      });

      themesOptions.unshift({
        text: 'None',
        subtext: 'No additonal theming, stick with default Discord',
        actual: ''
      });

      goosemodScope$a.stopLoadingScreen();

      const theme = (await selectionModal('Please pick a theme', themesOptions)).actual;

      let themeEls = document.getElementsByClassName('gm-setup-theme');

      for (let e of themeEls) {
        e.remove();
      }

      goosemodScope$a.startLoadingScreen();

      if (theme) {
        await installModules([theme]);
      }

      return res(packModules);
    });
  };

  var PackModal = {
    __proto__: null,
    setThisScope: setThisScope$9,
    ask: ask
  };

  let enabled = false;
  let todo = [
    'themes',
    'plugins'
  ];

  const done = (thing) => {
    todo.splice(todo.indexOf(thing), 1);
  };

  const themes = async () => {
    const ModulesPreview = (await Promise.resolve().then(function () { return modulesPreview$1; })).default();

    const { React } = goosemod.webpackModules.common;

    // const RoutingUtils = goosemod.webpackModules.findByProps('transitionTo');

    const Header = goosemod.webpackModules.findByDisplayName('Header');
    const Text = goosemod.webpackModules.findByDisplayName('Text');

    const possibleThemes = goosemod.moduleStoreAPI.modules.filter((x) => x.tags.includes('theme') && x.images && x.images[0]).sort((a, b) => b.github.stars - a.github.stars);
    const themeIndex = Math.floor(Math.random() * (possibleThemes.length - 5));

    goosemod.webpackModules.findByProps('show').show({
      className: 'gm-ootb-modal',

      title: 'Themes',

      confirmText: 'Browse Themes',

      onConfirm: async () => {
        if (goosemod.ootb.todo.length === 0) {
          /* while (document.querySelector('#gm-home-themes').classList.contains('selected-aXhQR6')) {
            await sleep(100);
          } */

          await sleep(2000);

          goosemod.ootb.settings();
        }
      },

      body: React.createElement('div', {
        className: 'container-1rn8Cv'
      },
        React.createElement(ModulesPreview, {
          modules: possibleThemes.slice(themeIndex, themeIndex + 3)
        }),

        React.createElement(Header, {
          className: "header-2MiVco",

          size: Header.Sizes.SIZE_24
        }, 'Beautify your Discord with Themes'),

        React.createElement(Text, {
          className: "byline-3REiHf",

          size: Text.Sizes.SIZE_16,
          color: Text.Colors.HEADER_SECONDARY
        }, 'Pick from over 100 themes to tweak and enhance your user interface')
      )
    });
  };

  const plugins = async () => {
    const ModulesPreview = (await Promise.resolve().then(function () { return modulesPreview$1; })).default();

    const { React } = goosemod.webpackModules.common;

    // const RoutingUtils = goosemod.webpackModules.findByProps('transitionTo');

    const Header = goosemod.webpackModules.findByDisplayName('Header');
    const Text = goosemod.webpackModules.findByDisplayName('Text');

    const possiblePlugins = goosemod.moduleStoreAPI.modules.filter((x) => !x.tags.includes('theme') && x.images && x.images[0]).sort((a, b) => b.github.stars - a.github.stars);
    const pluginIndex = Math.floor(Math.random() * (possiblePlugins.length - 5));

    goosemod.webpackModules.findByProps('show').show({
      className: 'gm-ootb-modal',

      title: 'Plugins',

      confirmText: 'Browse Plugins',

      onConfirm: async () => {
        if (goosemod.ootb.todo.length === 0) {
          /* while (document.querySelector('#gm-home-plugins').classList.contains('selected-aXhQR6')) {
            await sleep(100);
          } */

          await sleep(2000);

          goosemod.ootb.settings();
        }
      },

      body: React.createElement('div', {
        className: 'container-1rn8Cv'
      },
        React.createElement(ModulesPreview, {
          modules: possiblePlugins.slice(pluginIndex, pluginIndex + 3)
        }),

        React.createElement(Header, {
          className: "header-2MiVco",

          size: Header.Sizes.SIZE_24
        }, 'Amplify your Discord under the hood'),

        React.createElement(Text, {
          className: "byline-3REiHf",

          size: Text.Sizes.SIZE_16,
          color: Text.Colors.HEADER_SECONDARY
        }, 'Plugins augment your experience with improvements in the app itself')
      )
    });
  };

  const store = async () => {
    const ModulesPreview = (await Promise.resolve().then(function () { return modulesPreview$1; })).default();

    const { React } = goosemod.webpackModules.common;

    const RoutingUtils = goosemod.webpackModules.findByProps('transitionTo');

    const Header = goosemod.webpackModules.findByDisplayName('Header');
    const Text = goosemod.webpackModules.findByDisplayName('Text');

    const possibleModules = goosemod.moduleStoreAPI.modules.filter((x) => x.images && x.images[0]).sort((a, b) => b.github.stars - a.github.stars);
    const moduleIndex = Math.floor(Math.random() * (possibleModules.length - 5));

    goosemod.webpackModules.findByProps('show').show({
      className: 'gm-ootb-modal',

      title: 'Store',

      confirmText: 'View Store in Home',

      onConfirm: async () => {
        RoutingUtils.transitionTo('/channels/@me'); // Go to home

        await sleep(100);
        
        document.body.classList.add('gm-highlight');

        await sleep(3000);

        document.body.classList.remove('gm-highlight');
      },

      body: React.createElement('div', {
        className: 'container-1rn8Cv'
      },
        React.createElement(ModulesPreview, {
          modules: possibleModules.slice(moduleIndex, moduleIndex + 3)
        }),

        React.createElement(Header, {
          className: "header-2MiVco",

          size: Header.Sizes.SIZE_24
        }, 'Browse Themes and Plugins in the Store'),

        React.createElement(Text, {
          className: "byline-3REiHf",

          size: Text.Sizes.SIZE_16,
          color: Text.Colors.HEADER_SECONDARY
        }, 'GooseMod uses it\'s own Store, where you can easily look around and install')
      )
    });
  };

  const settings = async () => {
    const ModulesPreview = (await Promise.resolve().then(function () { return modulesPreview$1; })).default();

    const { React } = goosemod.webpackModules.common;

    const Header = goosemod.webpackModules.findByDisplayName('Header');
    const Text = goosemod.webpackModules.findByDisplayName('Text');

    goosemod.webpackModules.findByProps('show').show({
      className: 'gm-ootb-modal',

      title: 'Settings',

      confirmText: 'View GooseMod Settings',

      onConfirm: async () => {
        goosemod.settings.openSettings();

        await sleep(20);

        document.querySelector(`[aria-controls="gm-${goosemod.i18n.discordStrings.SETTINGS}-tab"]`).click(); // Open GM Settings page

        const scroller = document.querySelector(`.sidebarRegionScroller-3MXcoP`); // Scroll to bottom of Settings
        scroller.scrollTop = scroller.offsetHeight - 270;

        while (document.querySelector('.closeButton-1tv5uR')) {
          await sleep(100);
        }

        goosemod.ootb.community();
      },

      body: React.createElement('div', {
        className: 'container-1rn8Cv'
      },
        React.createElement(ModulesPreview, {
          modules: [
            {
              name: 'Experimental Features',
              description: 'Try out new experimental features'
            },

            {
              name: 'Utilities',
              description: 'Make backups, reset GooseMod, and more'
            },

            {
              name: 'Tweaks',
              description: 'Tweak GooseMod to how you want it'
            }
          ]
        }),

        React.createElement(Header, {
          className: "header-2MiVco",

          size: Header.Sizes.SIZE_24
        }, 'Use GooseMod\'s Settings to customise it\'s features'),

        React.createElement(Text, {
          className: "byline-3REiHf",

          size: Text.Sizes.SIZE_16,
          color: Text.Colors.HEADER_SECONDARY
        }, 'There are various options for you to change')
      )
    });
  };

  const community = async () => {
    const ModulesPreview = (await Promise.resolve().then(function () { return modulesPreview$1; })).default();

    const { React } = goosemod.webpackModules.common;

    const Header = goosemod.webpackModules.findByDisplayName('Header');
    const Text = goosemod.webpackModules.findByDisplayName('Text');

    goosemod.webpackModules.findByProps('show').show({
      className: 'gm-ootb-modal',

      title: 'Community',

      confirmText: 'Join GooseMod Discord',

      onConfirm: () => {
        window.open('https://goosemod.com/discord');
      },

      body: React.createElement('div', {
        className: 'container-1rn8Cv'
      },
        React.createElement(ModulesPreview, {
          modules: [
            {
              name: 'Ask Questions',
              description: 'Ask any questions and get support'
            },

            {
              name: 'News',
              description: 'Get the latest news and announcements around GooseMod and related projects'
            },

            {
              name: 'Get Involved',
              description: 'Help out with suggestions, supporting others, and more'
            }
          ]
        }),

        React.createElement(Header, {
          className: "header-2MiVco",

          size: Header.Sizes.SIZE_24
        }, 'Join GooseMod\'s Community'),

        React.createElement(Text, {
          className: "byline-3REiHf",

          size: Text.Sizes.SIZE_16,
          color: Text.Colors.HEADER_SECONDARY
        }, 'Join our Discord for further information and more')
      )
    });
  };

  const start = async () => {
    const ModulesPreview = (await Promise.resolve().then(function () { return modulesPreview$1; })).default();

    const { React } = goosemod.webpackModules.common;

    const Header = goosemod.webpackModules.findByDisplayName('Header');
    const Text = goosemod.webpackModules.findByDisplayName('Text');

    goosemod.webpackModules.findByProps('show').show({
      className: 'gm-ootb-modal',

      title: 'GooseMod',

      confirmText: 'Learn More',
      cancelText: 'Not Interested',

      onConfirm: () => {
        goosemod.ootb.enabled = true;

        goosemod.ootb.store();
      },

      body: React.createElement('div', {
        className: 'container-1rn8Cv'
      },
        React.createElement(ModulesPreview, {
          modules: [
            {
              name: 'Store',
              description: 'Learn about GooseMod\'s Store and what\'s in it'
            },

            {
              name: 'Settings',
              description: 'Find out about the settings for GooseMod and plugins'
            },

            {
              name: 'Community',
              description: 'Join our Discord to ask questions, give feedback, keep up to date with news, and more'
            }
          ]
        }),

        React.createElement(Header, {
          className: "header-2MiVco",

          size: Header.Sizes.SIZE_24
        }, 'Learn about GooseMod'),

        React.createElement(Text, {
          className: "byline-3REiHf",

          size: Text.Sizes.SIZE_16,
          color: Text.Colors.HEADER_SECONDARY
        }, 'Go through a short tour through GooseMod\'s core functions')
      )
    });
  };

  var OOTB = {
    __proto__: null,
    enabled: enabled,
    todo: todo,
    done: done,
    themes: themes,
    plugins: plugins,
    store: store,
    settings: settings,
    community: community,
    start: start
  };

  let loadingEl, descEl;

  let goosemodScope$9 = {};

  const setThisScope$8 = (scope) => {
    goosemodScope$9 = scope;
  };

  const startLoadingScreen = () => {
    loadingEl = document.createElement('div');

    loadingEl.style.position = 'absolute';
    loadingEl.style.transform = 'translateX(-25%)';
    loadingEl.style.left = '50%';
    loadingEl.style.top = '60px';

    loadingEl.style.zIndex = '9999';

    loadingEl.style.backgroundColor = 'var(--background-floating)';
    loadingEl.style.opacity = '0.9';
    loadingEl.style.borderRadius = '8px';
    loadingEl.style.padding = '16px';
    loadingEl.style.boxShadow = 'var(--elevation-high)';

    loadingEl.style.display = 'flex';
    loadingEl.style.flexDirection = 'column';
    loadingEl.style.alignItems = 'center';

    const titleEl = document.createElement('h1');

    titleEl.classList.add('name-1jkAdW', 'header-2V-4Sw');

    titleEl.style.marginBottom = '5px';

    titleEl.style.display = 'block';

    titleEl.style.boxShadow = 'none';
    titleEl.style.webkitBoxShadow = 'none';

    titleEl.textContent = `Loading GooseMod`;

    const versionEl = document.createElement('div');

    versionEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'modeDefault-3a2Ph1');

    versionEl.textContent = `v${goosemodScope$9.versioning.version} (${goosemodScope$9.versioning.hash.substring(0, 7)})`;

    versionEl.style.marginBottom = '20px';

    descEl = document.createElement('div');

    descEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'modeDefault-3a2Ph1');

    descEl.style.textAlign = 'center';
    descEl.style.whiteSpace = 'pre-line';

    descEl.textContent = `Starting up...`;

    loadingEl.appendChild(titleEl);
    loadingEl.appendChild(versionEl);
    loadingEl.appendChild(descEl);

    document.body.appendChild(loadingEl);
  };

  const updateLoadingScreen = (tip) => {
    descEl.textContent = tip;
  };

  const stopLoadingScreen = () => {
    loadingEl.remove();
  };

  let cache$1;

  const defaultSettings = {
    changelog: true,
    separators: true,
    gmBadges: true,
    attrs: false,
    home: true,

    devchannel: false,

    snippets: false,
    autoupdate: true,

    allThemeSettings: false,
    debugToasts: false
  };

  const get$2 = () => {
    // Cache as this function is called frequently
    if (cache$1) return cache$1;
    
    cache$1 = JSON.parse(goosemod.storage.get('goosemodGMSettings')) || defaultSettings;

    cache$1 = {
      ...defaultSettings,
      ...cache$1
    };

    return cache$1;
  };

  const set$2 = (key, value) => {
    const settings = get$2();

    settings[key] = value;

    goosemod.storage.set('goosemodGMSettings', JSON.stringify(settings));

    cache$1 = settings; // Set cache to new value
  };

  var GMSettings = {
    __proto__: null,
    get: get$2,
    set: set$2
  };

  var addToHome = async (goosemodScope) => {
    const { React, ReactDOM } = goosemodScope.webpackModules.common;

    const ConnectedPrivateChannelsList = goosemodScope.webpackModules.find((x) => x.default && x.default.displayName === 'ConnectedPrivateChannelsList');

    const ListSectionItem = goosemodScope.webpackModules.findByDisplayName('ListSectionItem');
    const { LinkButton } = goosemodScope.webpackModules.findByProps('LinkButton');

    const LinkButtonClasses = goosemodScope.webpackModules.findByProps('selected', 'wrappedName');
    const ChannelLinkButtonClasses = goosemodScope.webpackModules.findByProps('channel', 'linkButtonIcon');
    const HeaderClasses = goosemodScope.webpackModules.findByProps('headerText', 'privateChannelsHeaderContainer');
    const IconClasses = goosemodScope.webpackModules.findByProps('icon', 'iconBadge', 'title');
    const ScrollerClasses = goosemodScope.webpackModules.findByProps('scrollerBase', 'auto');

    const homeIcons = {
      themes: React.createElement(goosemodScope.webpackModules.findByDisplayName('Eye'), {
        width: 24,
        height: 24
      }),

      plugins: React.createElement(goosemodScope.webpackModules.findByDisplayName('InlineCode'), {
        width: 24,
        height: 24
      }),

      snippets: React.createElement(goosemodScope.webpackModules.findByDisplayName('Pictures'), {
        width: 24,
        height: 24
      }),

      expandable: React.createElement(goosemod.webpackModules.findByDisplayName('DropdownArrow'), {
        className: `${IconClasses.icon}`,

        width: 24,
        height: 24
      })
    };

    const Header = (await Promise.resolve().then(function () { return header$3; })).default();

    const LoadingPopout = goosemodScope.webpackModules.findByDisplayName('LoadingPopout');

    const makeHeader = (icon, title) => React.createElement(Header, {
      icon,
      title
    });

    const makeContent = (isLibrary, content) => React.createElement('div', {
      className: !isLibrary ? `${ScrollerClasses.auto}` : '',
      id: 'gm-settings-inject',

      style: {
        padding: '22px',
        backgroundColor: 'var(--background-primary)',

        height: '100%',
        overflow: !isLibrary ? 'hidden scroll' : ''
      }
    }, content);

    const makePage = (icon, title, content) => React.createElement('div', {
      style: {
        height: '100%',
        overflow: 'hidden'
      }
    },
      makeHeader(icon, title),

      makeContent(false, content)
    );

    const RoutingUtils = goosemodScope.webpackModules.findByProps('transitionTo');

    const findClassInParentTree = (el, className, depth = 0) => {
      if (depth > 5) return false;

      const parentEl = el.parentElement;
      return (parentEl.classList.contains(className) && parentEl) || findClassInParentTree(parentEl, className, depth + 1);
    };

    let expanded = goosemod.storage.get('goosemodHomeExpanded') || true;

    let settings = {
      plugins: goosemodScope.settings.items.find((x) => x[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins),
      themes: goosemodScope.settings.items.find((x) => x[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes),
      snippets: goosemodScope.settings.items.find((x) => x[1] === 'Snippets')
    };

    let contents = {
      plugins: goosemodScope.settings._createItem(settings.plugins[1], settings.plugins[2], false),
      themes: goosemodScope.settings._createItem(settings.themes[1], settings.themes[2], false),
      snippets: goosemodScope.settings._createItem(settings.snippets[1], settings.snippets[2], false)
    };

    const handleItemClick = (type) => {
      const parentEl = [...document.querySelector(`.content-98HsJk`).children].find((x, i) => i !== 0 && !x.classList.contains('erd_scroll_detection_container'));

      for (const x of document.querySelector(`.scroller-1JbKMe`).children[0].children) {
        if (!x.className?.replace) continue;
        x.className = x.className.replace(LinkButtonClasses.selected, LinkButtonClasses.clickable);
      }

      setTimeout(() => {
        const buttonEl = document.getElementById(`gm-home-${type}`);
        buttonEl.className = buttonEl.className.replace(LinkButtonClasses.clickable, LinkButtonClasses.selected);
      }, 0);

      const contentCards = type !== 'snippets' && Array.isArray(contents[type].props.children) ? contents[type].props.children.filter((x) => x.props.type === 'card').length : 0;
      const expectedModuleCount = type !== 'snippets' ? goosemodScope.moduleStoreAPI.modules.filter((x) => type === 'plugins' ? !x.tags.includes('theme') : x.tags.includes('theme')).length : 0;

      if (contentCards !== expectedModuleCount || goosemodScope.settings[`regen${type}`]) { // If amount of cards in generated React content isn't the same as amount of modules in Store
        delete goosemodScope.settings[`regen${type}`];

        contents[type] = React.createElement('div', { // Show loading indicator whilst wait
          className: 'gm-store-loading-container'
        },
          React.createElement(LoadingPopout)
        );

        (async () => {
          if (type !== 'snippets' && settings[type][2].filter((x) => x.type === 'card').length !== expectedModuleCount) { // Update store settings if card counts mismatch
            await goosemodScope.moduleStoreAPI.updateStoreSetting();
          }

          contents[type] = goosemodScope.settings._createItem(settings[type][1], settings[type][2], false); // Generate React content

          document.querySelector(`#gm-home-${type}`).click();
        })();
      }


      if (parentEl.children.length === 1) {
        ReactDOM.render(makePage(homeIcons[type], type, contents[type]), parentEl.children[0]);
      }
      
      if (parentEl.children.length === 2 || parentEl.children.length === 3) {
        let indexOffset = parentEl.children.length - 2;

        // Library has jank scroll elements so implement edge case
        const isLibrary = parentEl.children[indexOffset + 1].classList.contains('stickyScroller-24zUyY');
        if (isLibrary) indexOffset = 0;

        parentEl.children[indexOffset + 0].className = '';
        ReactDOM.render(makeHeader(homeIcons[type], type), parentEl.children[indexOffset + 0]);
        
        if (indexOffset !== 0 && parentEl.children[indexOffset + 1].children[1]) {
          parentEl.children[indexOffset + 1].children[1].style.display = 'none';
        }

        if (isLibrary) indexOffset = 1;

        ReactDOM.render(makeContent(isLibrary, contents[type]), indexOffset !== 0 ? parentEl.children[indexOffset + 1].children[0] : parentEl.children[indexOffset + 1]);
      }

      if (goosemodScope.ootb.enabled && goosemodScope.ootb.todo.includes(type)) {
        goosemodScope.ootb[type]();

        goosemodScope.ootb.done(type);
      }
    };
    
    const snippetsEnabled = goosemodScope.settings.gmSettings.get().snippets;

    goosemodScope.settingsUninjects.push(goosemodScope.patcher.patch(ConnectedPrivateChannelsList, 'default', (_args, res) => {
      if (res.props.children.slice(3).find((x) => x?.toString()?.includes('GooseMod'))) return;

      setTimeout(() => {
        document.querySelector(`.scroller-1JbKMe`).addEventListener('click', (e) => {
          const buttonEl = findClassInParentTree(e.target, ChannelLinkButtonClasses.channel);
          if (buttonEl && !buttonEl.id.startsWith('gm-home-')) {
            document.querySelectorAll('[id^="gm-home-"]').forEach((x) => x.className = x.className.replace(LinkButtonClasses.selected, LinkButtonClasses.clickable)); 

            setTimeout(() => {
              if (document.getElementById(`gm-settings-inject`) !== null) {
                RoutingUtils.transitionTo('/invalid');
                RoutingUtils.back();
              }
            }, 1);
          }
        });
      }, 10);

      res.props.children.push(
      () => React.createElement(ListSectionItem, {
        className: HeaderClasses.privateChannelsHeaderContainer
      },
        React.createElement('span', {
          className: HeaderClasses.headerText
        }, 'GooseMod'),

        React.createElement('div', {
          className: `${HeaderClasses.privateChannelRecipientsInviteButtonIcon} ${IconClasses.iconWrapper} ${IconClasses.clickable}`,

          style: {
            transform: `rotate(${expanded ? '0' : '-90'}deg)`,
            width: '22px',

            left: expanded ? '0px' : '-2px',
            top: expanded ? '-6px' : '-2px'
          },

          onClick: () => {
            expanded = !expanded;
            goosemod.storage.set('goosemodHomeExpanded', expanded);

            // Force update sidebar (jank DOM way)
            document.querySelector(`.scroller-1JbKMe`).dispatchEvent(new Event('focusin'));
            document.querySelector(`.scroller-1JbKMe`).dispatchEvent(new Event('focusout'));
          }
        },
          homeIcons.expandable
        )
      ),

      () => React.createElement(LinkButton, {
        style: {
          display: expanded || document.querySelector('.title-29uC1r')?.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes ? 'block' : 'none'
        },

        icon: () => homeIcons.themes,
        onClick: () => handleItemClick('themes'),

        id: 'gm-home-themes',

        text: goosemodScope.i18n.goosemodStrings.settings.itemNames.themes,

        selected: false
      }),

      () => React.createElement(LinkButton, {
        style: {
          display: expanded || document.querySelector('.title-29uC1r')?.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins ? 'block' : 'none'
        },

        icon: () => homeIcons.plugins,
        onClick: () => handleItemClick('plugins'),

        id: 'gm-home-plugins',

        text: goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins,

        selected: false
      }),

      snippetsEnabled ? () => React.createElement(LinkButton, {
        style: {
          display: expanded || document.querySelector('.title-29uC1r')?.textContent === 'Snippets' ? 'block' : 'none'
        },

        icon: () => homeIcons.snippets,
        onClick: () => handleItemClick('snippets'),

        id: 'gm-home-snippets',

        text: 'Snippets',

        selected: false
      }) : null
      );
    }));

    // If home currently open, force update sidebar via routing
    if (document.querySelector(`.privateChannels-1nO12o`)) {
      RoutingUtils.transitionTo('/invalid');
      RoutingUtils.back();
    }

    (async () => { // Pre-generate contents with cached modules
      // Make store setting with cached modules whilst waiting for hotupdate from repos
      await goosemodScope.moduleStoreAPI.updateStoreSetting();

      const snippetsLoaded = (JSON.parse(goosemod.storage.get('goosemodSnippets')) || {});

      for (const id in snippetsLoaded) {
        const css = snippetsLoaded[id];

        snippetsLoaded[id] = document.createElement('style');

        snippetsLoaded[id].appendChild(document.createTextNode(css));

        document.body.appendChild(snippetsLoaded[id]);
      }

      const snippetsLoad = async (channelId, label) => {
        const { fetchMessages } = goosemodScope.webpackModules.findByProps('fetchMessages');
        const { getRawMessages } = goosemodScope.webpackModules.findByProps('getMessages');
        const { getChannel, hasChannel } = goosemodScope.webpackModules.findByProps('getChannel');
    
        if (!hasChannel(channelId)) return;

        await fetchMessages({ channelId: channelId }); // Load messages
    
        const channel = getChannel(channelId);
        const messages = Object.values(getRawMessages(channelId))
          .filter((x) => x.content.includes('\`\`\`css') && // Make sure it has CSS codeblock
            !x.message_reference && // Exclude replies
            !x.content.includes('quick CSS') && // Exclude PC / BD specific snippets
            !x.content.includes('Theme Toggler')
          ).sort((a, b) => (b.attachments.length + b.embeds.length) - (a.attachments.length + a.embeds.length)); // Bias to favour images so we can have previews first
    
        const settingItem = goosemodScope.settings.items.find((x) => x[1] === 'Snippets');
    
        settingItem[2].push(
          {
            type: 'store-header',
            text: label
          },
          ...messages.map((x) => ({
            type: 'card',
    
            tags: [ x.id ],
            lastUpdated: 0,

            discordMessage: {
              guild: channel.guild_id,
              channel: channel.id,
              message: x.id
            },
    
            images: x.attachments[0] ? [ x.attachments[0].proxy_url ] : (x.embeds[0] ? [ x.embeds[0].thumbnail.proxy_url ] : []),
    
            name: '', // No name makes subtext main content (not gray)
            author: `<img style="display: inline; border-radius: 50%; margin-right: 5px; vertical-align: bottom;" src="https://cdn.discordapp.com/avatars/${x.author.id}/${x.author.avatar}.png?size=32"><span class="author" style="line-height: 32px;">${x.author.username}</span>`, // Based off Store author generation
    
            subtext: x.content.replace(/```css(.*)```/gs, ''), // Only context / text without code
    
            buttonText: snippetsLoaded[x.id] ? goosemodScope.i18n.discordStrings.REMOVE : goosemodScope.i18n.discordStrings.ADD,
            buttonType: snippetsLoaded[x.id] ? 'danger' : 'brand',

            onclick: () => {
              const cardSet = settingItem[2].find((y) => y.tags?.includes(x.id));
              const cardEl = document.querySelector(`[class*="${x.id}"]`);
              const buttonEl = cardEl.querySelector(`button`);
    
              goosemodScope.settings.regensnippets = true;

              if (snippetsLoaded[x.id]) { // Remove
                snippetsLoaded[x.id].remove();

                delete snippetsLoaded[x.id];

                buttonEl.className = buttonEl.className.replace('lookOutlined-3sRXeN colorRed-1TFJan', 'lookFilled-1Gx00P colorBrand-3pXr91');
                buttonEl.textContent = goosemodScope.i18n.discordStrings.ADD;

                cardSet.buttonText = goosemodScope.i18n.discordStrings.ADD;
                cardSet.buttonType = 'brand';
              } else { // Add
                snippetsLoaded[x.id] = document.createElement('style');

                snippetsLoaded[x.id].appendChild(document.createTextNode(/```css(.*)```/s.exec(x.content)[1]));

                document.body.appendChild(snippetsLoaded[x.id]);

                buttonEl.className = buttonEl.className.replace('lookFilled-1Gx00P colorBrand-3pXr91', 'lookOutlined-3sRXeN colorRed-1TFJan');
                buttonEl.textContent = goosemodScope.i18n.discordStrings.REMOVE;

                cardSet.buttonText = goosemodScope.i18n.discordStrings.REMOVE;
                cardSet.buttonType = 'danger';
              }

              const toSave = Object.assign({}, snippetsLoaded);

              for (const id in toSave) {
                toSave[id] = toSave[id].textContent;
              }

              goosemod.storage.set('goosemodSnippets', JSON.stringify(toSave));
            },

            showToggle: false, // No toggling snippets as overcomplex for small snippets
            isToggled: () => false
          }))
        );
      };

      await snippetsLoad('755005803303403570', 'Powercord CSS Snippets');
      await snippetsLoad('836694789898109009', 'BetterDiscord CSS Snippets');
      await snippetsLoad('449569809613717518', 'Black Box CSS Snippets');


      for (const type of ['themes', 'plugins', 'snippets']) {
        contents[type] = goosemodScope.settings._createItem(settings[type][1], settings[type][2], false); // Generate React contents
      }
    })();
  };

  var addToContextMenu = (goosemodScope, hasStoreInHome) => {
    const basicSettingItem = (name) => {
      return {
        label: name,
        action: async () => {
          goosemodScope.settings.openSettings();

          await sleep(10);

          [...(document.getElementsByClassName('side-8zPYf6')[0]).children].find((x) => x.textContent === name).click();
        }
      };
    };

    goosemodScope.settingsUninjects.push(goosemodScope.patcher.contextMenu.patch('user-settings-cog', {
      label: 'GooseMod',
      sub: [
        basicSettingItem(goosemodScope.i18n.discordStrings.SETTINGS),
        !hasStoreInHome ? basicSettingItem(goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins) : undefined,
        !hasStoreInHome ? basicSettingItem(goosemodScope.i18n.goosemodStrings.settings.itemNames.themes) : undefined,
        basicSettingItem(goosemodScope.i18n.discordStrings.CHANGE_LOG)
      ].filter((x) => x)
    }));

    goosemodScope.settingsUninjects.push(goosemodScope.patcher.contextMenu.patch('user-settings-cog', {
      label: goosemodScope.i18n.goosemodStrings.settings.itemNames.goosemodModules,
      sub: () => {
        const moduleItems = goosemodScope.settings.items.slice(goosemodScope.settings.items.indexOf(goosemodScope.settings.items.find((x) => x[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.goosemodModules)) + 1);

        return moduleItems.map((x) => basicSettingItem(x[1]));
      }
    }));
  };

  var addToSettingsSidebar = (goosemodScope, gmSettings) => {
    const SettingsView = goosemodScope.webpackModules.findByDisplayName('SettingsView');

    const Text = goosemodScope.webpackModules.findByDisplayName('Text');
    const VersionClasses = goosemodScope.webpackModules.findByProps('versionHash', 'line');

    const { React } = goosemodScope.webpackModules.common;
    
    goosemodScope.settingsUninjects.push(goosemodScope.patcher.patch(SettingsView.prototype, 'getPredicateSections', (_, sections) => {
      const logout = sections.find((c) => c.section === 'logout');
      if (!logout) return sections;
      
      sections.splice(
        sections.indexOf(logout), 0,
        
        ...goosemodScope.settings.items.filter((x) => (gmSettings.get().home ? x[1] !== goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins && x[1] !== goosemodScope.i18n.goosemodStrings.settings.itemNames.themes && x[1] !== 'Snippets': true) && (!gmSettings.get().snippets ? x[1] !== 'Snippets' : true)).map((i) => {
          switch (i[0]) {
            case 'item':
            let obj = {
              section: 'gm-' + i[1],
              label: i[1],
              predicate: () => { },
              element: function() {
                if (typeof i[3] === 'function') {
                  document.getElementsByClassName('selected-3s45Ha')[0].click();
                  
                  i[3]();
                  
                  return React.createElement('div');
                }
                
                const settingsLayerEl = document.querySelector('div[aria-label="USER_SETTINGS"]');
                const settingsSidebarEl = settingsLayerEl.querySelector('nav > div');
                
                if (i[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || i[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes || i[1] === 'Snippets') { // Settings expansion for Store panel
                  setTimeout(() => {
                    document.querySelector('.sidebarRegion-VFTUkN').style.maxWidth = '218px';
                    document.querySelector('.contentColumnDefault-1VQkGM').style.maxWidth = 'calc(100vw - 218px - 60px - 20px)';
                  }, 10);
                  
                  settingsSidebarEl.addEventListener('click', (e) => {
                    if (e.clientX === 0 // <el>.click() - not an actual user click - as it has no mouse position coords (0, 0)
                    || e.target.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || e.target.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes || e.target.textContent === 'Snippets') return;  // Clicking on Store when already in it should not break resizing
                    
                    document.querySelector('.sidebarRegion-VFTUkN').style.maxWidth = '50%';
                    document.querySelector('.contentColumnDefault-1VQkGM').style.maxWidth = '740px';
                  });
                }
                
                return goosemodScope.settings._createItem(i[1], i[2]);
              }
            };
            if (i[4]) obj.color = '#f04747';
            return obj;
            
            case 'heading':
            return {
              section: 'HEADER',
              label: i[1]
            };
            
            case 'separator':
            return {
              section: 'DIVIDER'
            };
          }
        }),
        
        {
          section: 'DIVIDER'
        }
      );
      
      
      sections.push(
        {
          section: 'DIVIDER'
        },

        {
          section: 'CUSTOM',
          element: () => React.createElement('div', {
            className: VersionClasses.info
          },
            React.createElement(Text, {
              className: VersionClasses.line,
              size: Text.Sizes.SIZE_12,
              color: Text.Colors.MUTED,
              tag: 'span'
            },
              'GooseMod', ' ', goosemodScope.versioning.version, ' ',
              React.createElement('span', {
                className: VersionClasses.versionHash
              }, '(', goosemodScope.versioning.hash.substring(0, 7), ')')
            ),

            React.createElement(Text, {
              className: VersionClasses.line,
              size: Text.Sizes.SIZE_12,
              color: Text.Colors.MUTED,
              tag: 'span'
            },
              'GooseMod Ext', ' ', window.gmExtension
            )
          )
        }
        );
        
        return sections;
      }));
  };

  var addBaseItems = (goosemodScope, gmSettings, Items) => {
    let oldItems = goosemodScope.settings.items;
    goosemodScope.settings.items = [];

    goosemodScope.settings.createHeading('GooseMod');

    const changeSetting = async (key, value) => {
      switch (key) {
        case 'changelog': {
          if (value) {
            const items = [
              ['item', goosemodScope.i18n.discordStrings.CHANGE_LOG, [''], async () => {
                show();
              }, false]
            ];

            if (gmSettings.get().separators) items.unshift(['separator']);

            goosemodScope.settings.items.splice(goosemodScope.settings.items.indexOf(goosemodScope.settings.items.find(x => x[1] === 'Themes')) + 1, 0,
              ...items
            );
          } else {
            goosemodScope.settings.items.splice(goosemodScope.settings.items.indexOf(goosemodScope.settings.items.find(x => x[1] === 'Change Log')), gmSettings.get().separators ? 2 : 1);
          }

          await goosemodScope.settings.reopenSettings();
          goosemodScope.settings.openSettingItem('Settings');

          break;
        }

        case 'devchannel': {
          if (value) {
            goosemod.storage.set('goosemodUntetheredBranch', 'dev');
          } else {
            goosemod.storage.remove('goosemodUntetheredBranch');
          }

          break;
        }

        case 'separators': {
          if (value) {
            if (!gmSettings.get().home) goosemod.settings.items.splice(2, 0, ['separator']);
            if (gmSettings.get().changelog) goosemod.settings.items.splice(4, 0, ['separator']);
          } else {
            let main = true;

            goosemodScope.settings.items = goosemodScope.settings.items.filter((x, i) => {
              if (goosemodScope.settings.items[i + 1] && goosemodScope.settings.items[i + 1][1] && goosemodScope.settings.items[i + 1][1] === 'GooseMod Modules') main = false;

              return !(x[0] === 'separator' && main);
            });
          }

          await goosemodScope.settings.reopenSettings();
          goosemodScope.settings.openSettingItem('Settings');

          break;
        }

        case 'gmBadges': {
          goosemodScope.gmBadges[value ? 'addBadges' : 'removeBadges']();

          break;
        }
      }

      gmSettings.set(key, value);
    };

    const refreshPrompt = async () => {
      if (await goosemodScope.confirmDialog('Refresh', 'Refresh Required', 'This setting **requires a refresh to take effect**. You **may experience some strange behaviour** in this session before refreshing.')) {
        location.reload();
      }
    };

    goosemodScope.settings.createItem(goosemodScope.i18n.discordStrings.SETTINGS, ['',
      {
        type: 'header',
        text: 'Settings'
      },

      {
        type: 'toggle',

        text: 'GooseMod Change Log',
        subtext: 'Show GooseMod "Change Log" setting',

        onToggle: (c) => changeSetting('changelog', c),
        isToggled: () => gmSettings.get().changelog
      },

      {
        type: 'toggle',

        text: 'Main Separators',
        subtext: 'Show separators between main GooseMod settings',

        onToggle: (c) => changeSetting('separators', c),
        isToggled: () => gmSettings.get().separators
      },

      {
        type: 'toggle',

        text: 'Store In Home',
        subtext: 'Put GooseMod Store options in home instead of in settings',

        onToggle: (c) => {
          changeSetting('home', c);
          refreshPrompt();
        },
        isToggled: () => gmSettings.get().home
      },

      {
        type: 'header',
        text: 'Store'
      },

      {
        type: 'toggle',

        text: 'Auto Update',
        subtext: 'Automatically update repos and modules every hour',

        onToggle: (c) => changeSetting('autoupdate', c),
        isToggled: () => gmSettings.get().autoupdate
      },

      {
        type: 'header',
        text: 'Appearance'
      },

      {
        type: 'toggle',

        text: 'GooseMod Badges',
        subtext: 'Shows GooseMod\'s badges',

        onToggle: (c) => changeSetting('gmBadges', c),
        isToggled: () => gmSettings.get().gmBadges
      },

      {
        type: 'header',
        text: 'Utilities'
      },

      {
        type: 'text-and-button',

        text: 'Purge Caches',
        subtext: 'Purges (completely removes) most caches GooseMod uses',
        buttonText: 'Purge',

        onclick: async () => {
          // Like remove's dynamic local storage removal, but only remove GooseMod keys with "Cache" in 
          goosemod.storage.keys().filter((x) => x.toLowerCase().startsWith('goosemod') && x.includes('Cache')).forEach((x) => goosemod.storage.remove(x));

          refreshPrompt();
        }
      },

      {
        type: 'text-and-button',

        text: 'Start Tour',
        subtext: 'Go through GooseMod\'s startup tour again',
        buttonText: 'Tour',

        onclick: async () => {
          goosemodScope.ootb.start();
        }
      },

      {
        type: 'text-and-button',

        text: 'Copy Debug Info',
        subtext: 'Copies information on setup and GooseMod for reporting and debugging',
        buttonText: 'Copy',

        onclick: async () => {
          const { copy } = goosemodScope.webpackModules.findByProps('copy', 'SUPPORTS_COPY');

          const mods = {
            powercord: 'powercord',
            vizality: 'vizality',
            ED: 'enhanceddiscord',
            BdApi: 'betterdiscord'
          };

          copy(`Discord:
Client: ${window.DiscordNative ? 'desktop' : 'web'}
User Agent: ${navigator.userAgent}
Release Channel: ${GLOBAL_ENV.RELEASE_CHANNEL}
Other Mods: ${Object.keys(mods).filter((x) => Object.keys(window).includes(x)).map((x) => mods[x]).join(', ')}

GooseMod:
GM Version: ${goosemodScope.versioning.version} (${goosemodScope.versioning.hash})
GM Branch: ${goosemodScope.storage.get('goosemodUntetheredBranch')}
GM Extension Version: ${window.gmExtension}
GM Storage Impl: ${goosemodScope.storage.type}
Modules: ${Object.keys(goosemodScope.modules).join(', ')}
`);
        }
      },

      {
        type: 'text-and-danger-button',
        
        text: 'Reset GooseMod',
        subtext: 'Resets GooseMod completely: removes all preferences and modules; like a first-time install',
        buttonText: 'Reset',

        onclick: async () => {
          if (await goosemodScope.confirmDialog('Reset', 'Reset GooseMod', 'Confirming will completely reset GooseMod, removing all preferences and modules; as if you had installed GooseMod for the first time. This is irreversible.')) {
            goosemodScope.remove();
            window.location.reload();
          }
        }
      },

      {
        type: 'header',
        text: 'Backup'
      },

      {
        type: 'text-and-button',

        text: 'Create Backup',
        subtext: 'Creates a file for backup of your GooseMod modules and settings',
        buttonText: 'Backup',

        onclick: () => {
          const obj = goosemod.storage.keys().filter((x) => x.toLowerCase().startsWith('goosemod') && !x.includes('Cache')).reduce((acc, k) => {
            acc[k] = goosemod.storage.get(k);
            return acc;
          }, {});

          const toSave = JSON.stringify(obj);

          const el = document.createElement("a");
          el.style.display = 'none';

          const file = new Blob([ toSave ], { type: 'application/json' });

          el.href = URL.createObjectURL(file);
          el.download = `goosemodBackup.json`;

          document.body.appendChild(el);

          el.click();

          el.remove();
        }
      },

      {
        type: 'text-and-button',

        text: 'Restore Backup',
        subtext: 'Restore your GooseMod modules and settings via a backup file, **only restore backups you trust**',
        buttonText: 'Restore',

        onclick: async () => {
          const el = document.createElement('input');
          el.style.display = 'none';
          el.type = 'file';

          el.click();

          await new Promise((res) => { el.onchange = () => { res(); }; });
          
          const file = el.files[0];
          if (!file) return;

          const reader = new FileReader();

          reader.onload = () => {
            const obj = JSON.parse(reader.result);

            for (const k in obj) {
              if (!k.startsWith('goosemod')) continue; // Don't set if not goosemod key for some security

              goosemod.storage.set(k, obj[k]);
            }

            location.reload();
          };

          reader.readAsText(file);
        }
      },

      {
        type: 'header',
        text: 'Experimental',
        // experimental: true
      },

      {
        type: 'subtext',
        text: 'Experimental settings are likely incomplete and unstable, which may result in a reduced experience'
      },

      {
        type: 'toggle',

        experimental: true,
        text: 'Development Channel',
        subtext: 'Use experimental development GooseMod builds',

        onToggle: (c) => {
          changeSetting('devchannel', c);
          refreshPrompt();
        },
        isToggled: () => goosemod.storage.get('goosemodUntetheredBranch') === 'dev'
      },

      {
        type: 'toggle',

        experimental: true,
        text: 'Data Attributes',
        subtext: 'Add data attributes to some elements for some themes to use',

        onToggle: (c) => {
          changeSetting('attrs', c);
          refreshPrompt();
        },
        isToggled: () => gmSettings.get().attrs
      },

      {
        type: 'toggle',

        experimental: true,
        text: 'Snippets',
        subtext: 'Enable Snippets tab in Store',

        onToggle: (c) => {
          changeSetting('snippets', c);
          refreshPrompt();
        },
        isToggled: () => gmSettings.get().snippets
      },

      {
        type: 'toggle',

        experimental: true,
        text: 'Force Theme Settings',
        subtext: 'Force auto-generated settings for all themes',

        onToggle: (c) => {
          changeSetting('allThemeSettings', c);
          refreshPrompt();
        },
        isToggled: () => gmSettings.get().allThemeSettings
      },

      /* {
        type: 'header',
        text: 'Debug',
        experimental: true
      },

      {
        type: 'toggle',

        debug: true,
        text: 'Add Debug Setting',
        subtext: 'Shows debug setting to test settings (per session, refresh to remove)',

        onToggle: () => {
          settingDebugShowing = true;

          goosemodScope.settings.createItem('Debug', ['',
            ...Object.keys(Items).filter((x) => x !== 'card').map((x) => ({
              type: x,

              text: x,
              label: x,

              subtext: 'subtext',

              buttonText: 'button text',
              placeholder: 'placeholder',

              initialValue: () => 'value',
              options: ['option 1', 'option 2', 'option 3'],
              isToggled: () => true,

              sort: () => 0,

              element: () => {
                const el = document.createElement('div');
                el.textContent = 'element text content';
                return el;
              }
            }))
          ]);
        },
        isToggled: () => settingDebugShowing,
        disabled: () => settingDebugShowing
      },

      {
        type: 'toggle',

        debug: true,
        text: 'Show Debug Toasts',
        subtext: 'Shows some debug toasts on some events',

        onToggle: (c) => changeSetting('debugToasts', c),
        isToggled: () => gmSettings.get().debugToasts
      }, */

      { type: 'gm-footer' }
    ]);

    if (gmSettings.get().separators && !gmSettings.get().home) goosemodScope.settings.createSeparator();

    let sortedVal = 'Stars';
    let authorVal = 'All';
    let searchQuery = '';

    const updateModuleStoreUI = () => {
      const cards = document.querySelectorAll(':not(.gm-store-category) > div > .gm-store-card');

      const fuzzyReg = new RegExp(`.*${searchQuery}.*`, 'i');

      let importedVal = document.querySelector('.selected-3s45Ha').textContent;
      if (importedVal !== 'Store' && importedVal !== 'Imported') importedVal = 'Store';

      for (let c of cards) {
        const titles = c.getElementsByClassName('title-31JmR4');

        const title = titles[1];

        const authors = [...titles[0].getElementsByClassName('author')].map((x) => x.textContent.split('#')[0]);
        const name = title.childNodes[0].wholeText;

        const description = c.getElementsByClassName('description-3_Ncsb')[0].innerText;

        const matches = (fuzzyReg.test(name) || fuzzyReg.test(description));

        const importedSelector = !c.getElementsByClassName('container-3auIfb')[0].classList.contains('hide-toggle') ? 'Imported' : 'Store';

        // const tags = [...c.classList].map((t) => t.replace(/\|/g, ' ').toLowerCase());

        switch (sortedVal) {
          case 'A-Z': { // Already pre-sorted to A-Z
            c.style.order = '';

            break;
          }

          case 'Last Updated': {
            const module = goosemodScope.moduleStoreAPI.modules.find((x) => x.name === name.trim());

            c.style.order = 3000000000 - module.lastUpdated;

            break;
          }

          case 'Stars': {
            c.style.order = 10000 - parseInt(c.children[4].children[0].children[0].textContent);

            break;
          }
        }

        c.style.display = matches
          && (importedVal === 'Store' || importedVal === importedSelector)
          && (authorVal === 'All' || authors.includes(authorVal.split(' (').slice(0, -1).join(' (')))
          ? 'block' : 'none';
      }

      const noInput = searchQuery === '' && importedVal === 'Store' && authorVal === 'All';

      [...document.getElementsByClassName('gm-store-category')].forEach((x) => x.style.display = noInput ? 'block' : 'none');

      // Keep all header but make height 0 so it breaks flex row
      const allHeader = document.querySelector(':not(.gm-store-category) > .gm-store-header');

      allHeader.style.height = !noInput ? '0px' : '';
      allHeader.style.opacity = !noInput ? '0' : '';
      allHeader.style.margin = !noInput ? '0' : '';
    };

    goosemodScope.settings.updateModuleStoreUI = updateModuleStoreUI;

    const genCurrentDate = new Date();

    const upcomingVal = (x) => {
      const daysSinceUpdate = (genCurrentDate - (x.lastUpdated * 1000)) / 1000 / 60 / 60 / 24;

      return (x.github.stars / daysSinceUpdate) - (x.github.stars / 2) + (1 - daysSinceUpdate);
    };

    [goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins, goosemodScope.i18n.goosemodStrings.settings.itemNames.themes].forEach((x) => goosemodScope.settings.createItem(x, ['',
      {
        type: 'search',

        placeholder: `${goosemodScope.i18n.discordStrings.SEARCH} ${x}`,

        onchange: (query) => {
          searchQuery = query;

          updateModuleStoreUI();
        },

        storeSpecific: true
      },

      {
        type: 'dropdown-individual',

        label: 'Sort by',

        options: [
          'Stars',
          'A-Z',
          'Last Updated'
        ],

        onchange: (val) => {
          sortedVal = val;

          updateModuleStoreUI();
        }
      },

      {
        type: 'dropdown-individual',

        label: 'Author',

        options: () => {
          const idCache = goosemodScope.moduleStoreAPI.idCache.getCache();

          const authors = [...goosemodScope.moduleStoreAPI.modules.reduce((acc, x) => {
            let authors = x.authors;

            if (!Array.isArray(authors)) authors = [ authors ];

            for (const a of authors) {
              let key = a;

              if (typeof a === 'object') {
                key = a.n;
              } else if (a.match(/^[0-9]{17,18}$/)) {
                key = idCache[a]?.data?.username;
              } else {
                const idMatch = a.match(/(.*) \(([0-9]{17,18})\)/); // "<name> (<id>)"

                if (idMatch !== null) {
                  key = idMatch[1];
                }
              }

              if (!key) continue;

              acc.set(key, (acc.get(key) || 0) + 1);
            }

            return acc;
          }, new Map()).entries()].sort((a, b) => b[1] - a[1]).map((x) => `${x[0]} (${x[1]})`);

          authors.unshift('All');
          
          return authors;
        },

        onchange: (val) => {
          authorVal = val;

          updateModuleStoreUI();
        }
      },

      {
        type: 'store-category',
        text: 'Top Starred',
        sort: (a, b) => b.github.stars - a.github.stars
      },

      {
        type: 'store-category',
        text: 'Recently Updated',
        sort: (a, b) => b.lastUpdated - a.lastUpdated
      },

      {
        type: 'store-category',
        text: 'Upcoming',
        sort: (a, b) => upcomingVal(b) - upcomingVal(a)
      },

      {
        type: 'store-header',
        text: `All ${x}`
      },

      { type: 'gm-footer' }
    ]));

    goosemodScope.settings.createItem('Snippets', ['',
      {
        type: 'search',

        placeholder: 'Search Snippets',

        onchange: (query) => {
          const cards = document.getElementsByClassName('gm-store-card');

          const fuzzyReg = new RegExp(`.*${query}.*`, 'i');

          for (const c of cards) {
            const description = c.getElementsByClassName('markdown-11q6EU')[0].textContent;

            const matches = (fuzzyReg.test(description));

            c.style.display = matches ? '' : 'none';
          }
        },

        storeSpecific: true
      }
    ]);

    if (gmSettings.get().changelog) {
      if (gmSettings.get().separators) goosemodScope.settings.createSeparator();

      goosemodScope.settings.createItem(goosemodScope.i18n.discordStrings.CHANGE_LOG, [""], async () => {
        show();
      });
    }

    goosemodScope.settings.createSeparator();

    goosemodScope.settings.createHeading(goosemodScope.i18n.goosemodStrings.settings.itemNames.goosemodModules);

    goosemodScope.settings.items = goosemodScope.settings.items.concat(oldItems);
  };

  var addCustomCss = () => {
    const el = document.createElement('style');

    el.appendChild(document.createTextNode(`
#gm-settings-inject > div, .gm-store-settings {
  display: flex;
  flex-flow: row wrap;

  align-items: center;
  justify-content: center;
}

.gm-store-settings > h1 {
  flex-basis: 100%;
}

.gm-inline-dropdown {
  display: flex;
  align-items: center;

  margin-left: 12px;
}

.gm-inline-dropdown > .select-2TCrqx {
  width: 120px;
  margin-left: 8px;
}

.gm-store-search {
  flex-grow: 1;

  margin-right: 12px;
}

.gm-store-header {
  margin-bottom: 0;

  width: 100%;
  max-width: 100%;
}


.gm-store-card {
  box-shadow: var(--elevation-medium);
  background-color: var(--background-secondary);

  border-radius: 8px;
  box-sizing: border-box;

  padding: 12px;
  margin: 10px;

  width: 330px;
  height: 380px;

  position: relative;
}

.gm-store-card > :nth-child(1) {
  width: calc(100% + 24px);
  height: 200px;

  border-radius: 8px 8px 0 0;

  margin-top: -12px;
  margin-left: -12px;

  background-color: var(--background-secondary-alt);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50%;

  text-align: center;
  line-height: 200px;

  color: var(--interactive-normal);
  font-family: var(--font-display);
  font-size: 36px;
}

.gm-store-card > :nth-child(2) {
  position: absolute;
  top: 152px;
  right: 10px;

  opacity: 0.95;

  border-radius: 16px;

  background-color: rgba(0, 0, 0, 0.5);
  width: fit-content;

  padding-right: 10px;
}

.gm-store-card > :nth-child(2).no-pfp {
  padding: 4px 8px;
}

.gm-store-card > :nth-child(3) {
  width: 85%;
  margin-top: 10px;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.gm-store-card > :nth-child(4) {
  width: 85%;
  margin-top: 5px;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  clear: both;
}

.gm-store-card > :nth-child(5) {
  display: flex;
  align-items: center;
  flex-direction: column;
  order: 2;
  margin-left: auto;
  position: absolute;
  top: 208px;
  right: 12px;
  width: calc(15% - 12px);
}

.gm-store-card > :nth-child(5) > :nth-child(1) {
  width: max-content;
}

.gm-store-card > :nth-child(5) > :nth-child(1) > :nth-child(1) {
  position: relative;
  top: 7px;
  font-size: 18px;
  font-weight: 600;
}

.gm-store-card > :nth-child(5) > :nth-child(1) > :nth-child(2) {
  position: relative;
  top: 8px;
  margin-left: 5px;
}

.gm-store-card > :nth-child(5) > :nth-child(2) {
  margin-top: 20px;

  text-align: center;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100%;
  line-break: anywhere;
}

.gm-store-card > :nth-child(6) {
  position: absolute;
  bottom: 12px;
  width: calc(100% - 32px);
  display: flex;
  gap: 5px;
}

.gm-store-card > :nth-child(6) > :nth-child(1) {
  display: inline-flex;
  cursor: pointer;
  width: 90px;
}

.gm-store-card > :nth-child(6) > :nth-child(2) {
  width: auto;
  margin-left: 14px;
  min-width: 0px;
  padding: 2px 5px;
  color: rgb(221, 221, 221);
  display: inline-flex;
  cursor: pointer;
}

.gm-store-card > :nth-child(6) > :nth-child(3) {
  margin-top: 4px;
  position: absolute;
  right: -10px;
}

.gm-store-card > :nth-child(6) > :nth-child(3).hide-toggle {
  display: none !important;
}

/* Mini cards (profile store) */
.gm-store-card-mini {
  width: 100%;
  height: 74px;
}

.gm-store-card-mini > :nth-child(1) {
  background-color: unset;
  right: 0px;
  position: absolute;
  width: 120px;
  border-radius: 0 8px 8px 0;
  height: 100%;
}

.gm-store-card-mini > :nth-child(3) {
  margin-top: 0;
}

.gm-store-card-mini > :nth-child(4) {
  -webkit-line-clamp: 1;
  width: 75%;
}

.gm-store-card-mini > :nth-child(2), .gm-store-card-mini > :nth-child(5), .gm-store-card-mini > :nth-child(6) {
  display: none;
}

.gm-modules-container {
  display: flex;
  grid-template-columns: none;
  flex-flow: row wrap;
  justify-content: center;
}


.gm-store-category {
  width: 100%;
}

.gm-store-category > :nth-child(2) {
  display: grid;
  overflow-x: scroll;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-auto-flow: column;
  width: 100%;
}


.gm-store-loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}


.gm-settings-note-markdown {
  font-size: inherit;
  color: inherit !important;
}

.gm-settings-note-markdown .paragraph-3Ejjt0 {
  margin: 0;
}

.gm-settings-label-icon {
  vertical-align: sub;
}

.gm-settings-label-text {
  vertical-align: top;
  margin-left: 6px;
}

.gm-settings-header-collapser {
  margin-top: -3px;
  float: right;
  width: 22px;
  height: 22px;
}

.gm-settings-header-collapser.collapsed {
  transform: rotate(-90deg);
}


/* Store image carousel */
.gm-carousel-modal {
  background-color: var(--background-primary);
  border-radius: 6px;
  padding: 12px;

  pointer-events: all;
}

.gm-carousel-modal .outer-s4sY2_ {
  width: 50vw;
  height: 30vw;

  padding-top: 0 !important;

  background-color: var(--background-secondary-alt);
}

.gm-carousel-modal .root-3tU4d2 {
  background-color: unset;
}

.gm-carousel-modal .smallCarouselImage-2Qvg9S {
  cursor: default;
}


/* OOTB */
.gm-modules-preview .guildIcon-cyDh6h {
  display: none;
}

.gm-modules-preview .cardHeader-2XrQbx {
  margin-bottom: 12px;
}

.gm-modules-preview .card-3_CqkU {
  background-color: var(--background-tertiary);
}

.gm-ootb-modal {
  width: 600px;
}

.gm-highlight #app-mount::after {
  display: block;
  content: '';

  box-shadow: 0 0 0 99999px rgb(0 0 0 / 50%);
  z-index: 9;
}

.gm-highlight .content-3YMskv [id*="gm"] {
  filter: brightness(2);
  background: var(--background-modifier-selected);

  border-radius: 0;
  z-index: 10;

  transition: all .5s;
}

/* Repos modal icons */
.gm-repos-modal-icon-Verified {
  color: var(--status-positive-background);
}

.gm-repos-modal-icon-Alert {
  color: var(--status-danger-background);
}

.gm-repos-modal-icon-Alert .icon-1ihkOt {
  width: 12px;
  height: 12px;
}

.gm-repos-modal-icon-Help {
  color: var(--status-warning-background);
}

/* GM Error Boundary */
.gm-error-boundary {
  display: flex;
  flex-flow: column;

  width: 100%;
  height: 100%;
}

.gm-error-boundary > :first-child {
  display: flex;
  justify-content: center;

  width: 100%;
}

.gm-error-boundary > :first-child > :first-child {
  display: block;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50%;
  overflow: hidden;
  pointer-events: none;
  object-fit: cover;

  height: 48px;
  width: 48px;
  margin-right: 22px;

  border-radius: 50%;
  background-image: url("https://goosemod.com/img/goose_glitch.jpg");
}

.gm-error-boundary > :first-child > :nth-child(2) {
  margin-top: -2px;
}

.gm-error-boundary > :first-child > :nth-child(2) .title-3KTIjF {
  color: var(--interactive-normal);
  font-family: var(--font-primary);

  margin-left: 1px;
  margin-bottom: 0;
}

.gm-error-boundary > :nth-child(2) {
  display: flex;
  justify-content: center;

  width: 100%;

  margin-top: 28px;
  gap: 40px;
}

.gm-error-boundary > :nth-child(3) {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  margin-top: 28px;
  color: var(--header-secondary);
}

.gm-error-boundary > :nth-child(3) > :nth-child(1) {
  width: 24px;
  height: 24px;

  margin-right: 4px;
}

.gm-error-boundary > :nth-child(4) {
  width: 100%;
  margin-top: 8px;
}

.gm-error-boundary > :nth-child(4) pre {
  margin-bottom: 28px;
}

/* Discord fixes */
/* Color picker is behind settings layer (and other things like modals / etc) */
.layer-v9HyYc {
  z-index: 999;
}
`));

    document.body.appendChild(el);
  };

  var getItems = async () => ({
    divider: (await Promise.resolve().then(function () { return divider; })).default(),
    header: (await Promise.resolve().then(function () { return header$1; })).default(),
    toggle: (await Promise.resolve().then(function () { return toggle$1; })).default(),
    text: (await Promise.resolve().then(function () { return text$1; })).default(),
    'text-and-button': (await Promise.resolve().then(function () { return textAndButton$1; })).default(),
    'text-and-color': (await Promise.resolve().then(function () { return textAndColor$1; })).default(),
    button: (await Promise.resolve().then(function () { return button$1; })).default(),
    search: (await Promise.resolve().then(function () { return search$1; })).default(),
    'dropdown-individual': (await Promise.resolve().then(function () { return dropdownIndividual$1; })).default(),
    'store-header': (await Promise.resolve().then(function () { return storeHeader; })).default(),
    card: (await Promise.resolve().then(function () { return card; })).default(),
    'store-category': (await Promise.resolve().then(function () { return storeCategory$1; })).default(),
    custom: (await Promise.resolve().then(function () { return custom$1; })).default(),
    'text-input': (await Promise.resolve().then(function () { return textInput$1; })).default(),
    subtext: (await Promise.resolve().then(function () { return subtext$1; })).default()
  });

  const gmSettings = GMSettings;
  let Items = {};

  let goosemodScope$8 = {};

  const setThisScope$7 = async (scope) => {
    goosemodScope$8 = scope;

    Items = await getItems();
  };


  const removeModuleUI = (field, where) => {
    // let settingItem = goosemodScope.settings.items.find((x) => x[1] === 'Local Modules');

    // settingItem[2].splice(settingItem[2].indexOf(settingItem[2].find((x) => x.subtext === goosemodScope.modules[field].description)), 1);

    const isDisabled = goosemodScope$8.modules[field] === undefined; // If module is currently disabled
    if (isDisabled) {
      goosemodScope$8.modules[field] = Object.assign({}, goosemodScope$8.disabledModules[field]); // Move from disabledModules -> modules
      delete goosemodScope$8.disabledModules[field];
    }

    goosemodScope$8.moduleStoreAPI.moduleRemoved(goosemodScope$8.modules[field]);

    if (!isDisabled) goosemodScope$8.modules[field].goosemodHandlers.onRemove();

    delete goosemodScope$8.modules[field];

    goosemodScope$8.moduleSettingsStore.clearModuleSetting(field);

    // goosemodScope.settings.createFromItems();

    if (where) goosemodScope$8.settings.openSettingItem(where);
  };

  const isSettingsOpen = () => {
    return document.querySelector('div[aria-label="USER_SETTINGS"] .closeButton-1tv5uR') !== null;
  };

  const closeSettings = () => {
    let closeEl = document.querySelector('div[aria-label="USER_SETTINGS"] .closeButton-1tv5uR');
    
    if (closeEl === null) return false;
    
    closeEl.click(); // Close settings via clicking the close settings button
  };

  const openSettings = () => {
    document.querySelector('.flex-1xMQg5.flex-1O1GKY.horizontal-1ae9ci.horizontal-2EEEnY.flex-1O1GKY.directionRow-3v3tfG.justifyStart-2NDFzi.alignStretch-DpGPf3.noWrap-3jynv6 > [type="button"]:last-child').click();
  };

  const openSettingItem = (name) => {
    try {
      const children = [...(document.querySelector('div[aria-label="USER_SETTINGS"]').querySelector('nav > div')).children];

      children[1].click(); // To refresh / regenerate

      setTimeout(() => children.find((x) => x.textContent === name).click(), 5);

      return true;
    } catch (e) {
      return false;
    }
  };

  const reopenSettings = async () => {
    goosemodScope$8.settings.closeSettings();

    await sleep(500);

    goosemodScope$8.settings.openSettings();

    await sleep(100);
  };

  let items = [];

  const createItem = (panelName, content, clickHandler, danger = false) => {
    goosemodScope$8.settings.items.push(['item', panelName, content, clickHandler, danger]);
  };

  const removeItem = (setting) => {
    const ind = goosemodScope$8.settings.items.indexOf(goosemodScope$8.settings.items.find((x) => x[1] === setting));

    // Trying to remove non-existant item
    if (ind === -1) return false;

    goosemodScope$8.settings.items.splice(ind, 1);
  };

  const createHeading = (headingName) => {
    goosemodScope$8.settings.items.push(['heading', headingName]);
  };

  const createSeparator = () => {
    goosemodScope$8.settings.items.push(['separator']);
  };

  const _createItem = (name, content, container = true) => {
    const { React } = goosemodScope$8.webpackModules.common;

    const FormSection = goosemodScope$8.webpackModules.findByDisplayName('FormSection');
    const FormTitle = goosemodScope$8.webpackModules.findByDisplayName('FormTitle');

    const makeContent = () => content.slice(1).map((x, i) => {
      if (x.type.includes('danger-button')) {
        x.type = x.type.replace('danger-', '');
        x.danger = true;
      }

      const component = Items[x.type];

      if (!component) return React.createElement('div');

      return React.createElement(component, {
        i,
        ...x,
        itemName: name
      });
    });

    return container ? React.createElement(FormSection, {
        className: name === goosemodScope$8.i18n.goosemodStrings.settings.itemNames.plugins || name === goosemodScope$8.i18n.goosemodStrings.settings.itemNames.themes ? 'gm-store-settings' : ''
      },

      React.createElement(FormTitle, { tag: 'h1' }, name),

      makeContent()
    ) : React.createElement('div', { },
      makeContent()
    );
  };

  const makeGooseModSettings = () => {
    goosemodScope$8.settingsUninjects = [];

    addBaseItems(goosemodScope$8, gmSettings);

    addToSettingsSidebar(goosemodScope$8, gmSettings);
    addToContextMenu(goosemodScope$8, gmSettings.get().home);
    if (gmSettings.get().home) addToHome(goosemodScope$8);

    addCustomCss();

    loadColorPicker();
  };

  const loadColorPicker = () => { // Force load ColorPicker as it's dynamically loaded
    const { findInReactTree } = goosemodScope$8.reactUtils;

    if (!goosemodScope$8.webpackModules.findByDisplayName('ColorPicker')) {
      const GuildFolderSettingsModal = goosemodScope$8.webpackModules.findByDisplayName('GuildFolderSettingsModal');
      const instance = GuildFolderSettingsModal.prototype.render.call({ props: {}, state: {}});
    
      findInReactTree(instance.props.children, (x) => x.props?.colors).type().props.children.type._ctor();
    }
  };

  var Settings = {
    __proto__: null,
    gmSettings: gmSettings,
    setThisScope: setThisScope$7,
    removeModuleUI: removeModuleUI,
    isSettingsOpen: isSettingsOpen,
    closeSettings: closeSettings,
    openSettings: openSettings,
    openSettingItem: openSettingItem,
    reopenSettings: reopenSettings,
    items: items,
    createItem: createItem,
    removeItem: removeItem,
    createHeading: createHeading,
    createSeparator: createSeparator,
    _createItem: _createItem,
    makeGooseModSettings: makeGooseModSettings
  };

  var ab2str = (buf) => { // ArrayBuffer (UTF-8) -> String
    return new TextDecoder().decode(buf);
    //return String.fromCharCode.apply(null, new Uint8Array(buf));
  };

  const evalGlobal = eval;

  const makeSourceURL = (name) => `${name} | GM Module`.replace(/ /g, '%20');

  let goosemodScope$7 = {};

  const setThisScope$6 = (scope) => {
    goosemodScope$7 = scope;
  };

  const importModule = async (f, disabled = false) => {
    let field = f.name;

    goosemodScope$7.logger.debug('import', `Importing module: "${field}"`);

    if (goosemodScope$7.modules[field]?.goosemodHandlers?.onImport !== undefined) {
      goosemodScope$7.logger.debug(`import.load.module.${field}`, 'Module already imported, removing then installing new version');

      await goosemodScope$7.modules[field].goosemodHandlers.onRemove();
    }

    if (typeof f.data === 'object') { // ArrayBuffer (UTF-8) -> String
      f.data = ab2str(f.data);
    }

    const modulesKey = !disabled ? 'modules' : 'disabledModules';

    goosemodScope$7[modulesKey][field] = Object.assign(evalGlobal(`const goosemodScope=goosemod;` + f.data + ` //# sourceURL=${makeSourceURL(f.name)}`), f.metadata); // Set goosemodScope.modules.<module_name> to the return value of the module (an object containing handlers)

    if (disabled) return;


    await goosemodScope$7.modules[field].goosemodHandlers.onImport(); // Run the module's onImport handler
  };

  let goosemodScope$6 = {};

  const setThisScope$5 = (scope) => {
    goosemodScope$6 = scope;
  };


  const disableModule = (name) => {
    let settings = JSON.parse(goosemod.storage.get('goosemodDisabled')) || {};

    settings[name] = true;

    goosemod.storage.set('goosemodDisabled', JSON.stringify(settings));
  };

  const enableModule = (name) => {
    let settings = JSON.parse(goosemod.storage.get('goosemodDisabled')) || {};

    delete settings[name];

    goosemod.storage.set('goosemodDisabled', JSON.stringify(settings));
  };

  const checkDisabled = (name) => {
    return Object.keys(JSON.parse(goosemod.storage.get('goosemodDisabled')) || {}).includes(name);
  };


  const saveModuleSettings = async () => {
    //goosemodScope.logger.debug('settings', 'Saving module settings...');

    let settings = JSON.parse(goosemod.storage.get('goosemodModules')) || {};

    for (let p in goosemodScope$6.modules) {
      if (goosemodScope$6.modules.hasOwnProperty(p)) {
        try {
          settings[p] = await (goosemodScope$6.modules[p].goosemodHandlers.getSettings || (async () => []))();
        } catch (e) {
          console.error('Failed to load settings to save module', p, e);
        }
      }
    }

    if (JSON.stringify(JSON.parse(goosemod.storage.get('goosemodModules'))) !== JSON.stringify(settings)) {
      goosemod.storage.set('goosemodModules', JSON.stringify(settings));

      // goosemodScope.showToast('Settings saved');
    }
  };

  const clearModuleSetting = (moduleName) => {
    let settings = JSON.parse(goosemod.storage.get('goosemodModules'));

    if (!settings || !settings[moduleName]) return;

    delete settings[moduleName];

    goosemod.storage.set('goosemodModules', JSON.stringify(settings));
  };

  const clearSettings = () => {
    goosemod.storage.remove('goosemodModules');
  };

  const loadSavedModuleSetting = async (moduleName) => {
    let settings = JSON.parse(goosemod.storage.get('goosemodModules'));

    if (!settings || !settings[moduleName]) return;

    await (goosemodScope$6.modules[moduleName].goosemodHandlers.loadSettings || (async () => []))(settings[moduleName]);
  };

  /* export const loadSavedModuleSettings = async () => {
    //goosemodScope.logger.debug('settings', 'Loading module settings...');

    let settings = JSON.parse(goosemod.storage.get('goosemodModules'));

    if (!settings) return;

    for (let p in goosemodScope.modules) {
      if (goosemodScope.modules.hasOwnProperty(p) && settings.hasOwnProperty(p)) {
        await (goosemodScope.modules[p].goosemodHandlers.loadSettings || (async () => []))(settings[p]);
      }
    }

    return settings;
  }; */

  var ModuleSettingsStore = {
    __proto__: null,
    setThisScope: setThisScope$5,
    disableModule: disableModule,
    enableModule: enableModule,
    checkDisabled: checkDisabled,
    saveModuleSettings: saveModuleSettings,
    clearModuleSetting: clearModuleSetting,
    clearSettings: clearSettings,
    loadSavedModuleSetting: loadSavedModuleSetting
  };

  let openpgp = undefined;

  // Dynamically load library as bundle size dramatically (3x) increases if we just import / use with NPM
  const loadLibrary = async () => {
    const js = await (await fetch(`https://api.goosemod.com/pgp.js`, { cache: 'force-cache' })).text();

    openpgp = (eval(js + ';openpgp'));
  };

  const verifySignature = async (_publicKey, _signature, _original) => {
    if (!openpgp) await loadLibrary();

    const publicKey = await openpgp.readKey({ armoredKey: _publicKey });

    const message = await openpgp.createMessage({ text: _original });

    const signature = await openpgp.readSignature({
      armoredSignature: _signature // parse detached signature
    });

    const verificationResult = await openpgp.verify({
        message, // Message object
        signature,
        verificationKeys: publicKey
    });

    const { verified, keyID } = verificationResult.signatures[0];

    try {
        await verified; // throws on invalid signature

        goosemod.logger.debug('pgp', 'verified, key id:', keyID.toHex());
        return true;
    } catch (e) {
        goosemod.logger.debug('pgp', 'failed to verify', e.message);
        return false;
    }
  };

  const hash = async (str, algorithm) => {
    const buf = await crypto.subtle.digest(algorithm, new TextEncoder('utf-8').encode(str));
    return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
  };
  const sha512 = (str) => hash(str, 'SHA-512');

  let goosemodScope$5 = {};

  const setThisScope$4 = (scope) => {
    goosemodScope$5 = scope;
  };

  const getCache$2 = () => JSON.parse(goosemod.storage.get('goosemodJSCache') || '{}');
  const purgeCache$2 = () => goosemod.storage.remove('goosemodJSCache');

  const updateCache$2 = (moduleName, hash, js) => {
    let cache = goosemodScope$5.moduleStoreAPI.jsCache.getCache();

    cache[moduleName] = {hash, js};

    goosemod.storage.set('goosemodJSCache', JSON.stringify(cache));
  };

  const getJSForModule = async (moduleName) => {
    const moduleInfo = goosemodScope$5.moduleStoreAPI.modules.find((x) => x.name === moduleName);
    const cache = goosemodScope$5.moduleStoreAPI.jsCache.getCache();

    if (cache[moduleName] && moduleInfo.hash === cache[moduleName].hash) {
      return cache[moduleName].js;
    } else {
      const baseUrl = moduleInfo.repo.split('/').slice(0, -1).join('/');

      const js = await (await fetch(`${baseUrl}/module/${moduleName}.js?_=${Date.now()}`)).text();

      goosemodScope$5.moduleStoreAPI.jsCache.updateCache(moduleName, moduleInfo.hash, js);

      return js;
    }
  };

  var JSCache = {
    __proto__: null,
    setThisScope: setThisScope$4,
    getCache: getCache$2,
    purgeCache: purgeCache$2,
    updateCache: updateCache$2,
    getJSForModule: getJSForModule
  };

  const currentDate = new Date() - 0;

  let goosemodScope$4 = {};

  let getUser;

  let queueProcessInterval;

  const setThisScope$3 = (scope) => {
    goosemodScope$4 = scope;

    getUser = goosemodScope$4.webpackModules.findByProps('getUser', 'fetchCurrentUser').getUser;
  };

  const queue = [], queueReturns = [];

  const processQueue = async () => {
    if (queue.length === 0) {
      clearInterval(queueProcessInterval);
      queueProcessInterval = undefined;

      return;
    }

    const id = queue.pop();

    queueReturns.push(await getUser(id));
  };

  const getCache$1 = () => JSON.parse(goosemod.storage.get('goosemodIDCache') || '{}');
  const purgeCache$1 = () => goosemod.storage.remove('goosemodIDCache');

  const updateCache$1 = (id, data) => {
    let cache = getCache$1();

    cache[id] = {
      data,
      time: currentDate
    };

    goosemod.storage.set('goosemodIDCache', JSON.stringify(cache));
  };

  const getDataForID = async (id) => {
    const cache = getCache$1();

    if (cache[id] && cache[id].time > currentDate - (1000 * 60 * 60 * 24)) {
      return cache[id].data;
    } else {
      queue.push(id);

      if (!queueProcessInterval) {
        queueProcessInterval = setInterval(processQueue, 500);
        processQueue();
      }

      let data;

      while (true) {
        data = queueReturns.find((x) => x.id === id);

        if (data) {
          queueReturns.splice(queueReturns.indexOf(data), 1);
          break;
        }

        await sleep(500);
      }

      updateCache$1(id, data);

      return data;
    }
  };

  var IDCache = {
    __proto__: null,
    setThisScope: setThisScope$3,
    getCache: getCache$1,
    purgeCache: purgeCache$1,
    updateCache: updateCache$1,
    getDataForID: getDataForID
  };

  let goosemodScope$3 = {};

  var moduleStoreAPI = {
    setThisScope: (scope) => {
      goosemodScope$3 = scope;

      setThisScope$4(scope);
      setThisScope$3(scope);
    },

    modules: [],
    repos: [],

    apiBaseURL: 'https://api.goosemod.com',
    storeApiBaseURL: 'https://store.goosemod.com',

    jsCache: JSCache,
    idCache: IDCache,

    getSettingItemName: (moduleInfo) => {
      let item = goosemodScope$3.i18n.goosemodStrings.settings.itemNames.plugins;

      if (moduleInfo.tags.includes('theme')) item = goosemodScope$3.i18n.goosemodStrings.settings.itemNames.themes;

      return item;
    },

    hotupdate: async (shouldHandleLoadingText = false) => { // Update repos, hotreload any updated modules (compare hashes to check if updated)
      if (shouldHandleLoadingText) goosemodScope$3.updateLoadingScreen(`Getting modules from repos...`);

      await goosemodScope$3.moduleStoreAPI.updateModules();
    
      await goosemodScope$3.moduleStoreAPI.updateStoreSetting();

      if (shouldHandleLoadingText) goosemodScope$3.updateLoadingScreen(`Updating modules...`);

      const repoPgpChecks = {};

      const updatePromises = [];

      for (const m in goosemodScope$3.modules) {
        const msHash = goosemodScope$3.moduleStoreAPI.modules.find((x) => x.name === m)?.hash;

        const cacheHash = goosemodScope$3.moduleStoreAPI.jsCache.getCache()[m]?.hash;

        if (msHash === undefined || cacheHash === undefined || msHash === cacheHash) continue;

        if (repoPgpChecks[m.repo] === undefined) { // Force check repo's PGP if updating from there
          const repo = goosemodScope$3.moduleStoreAPI.repos.find((x) => x.url === m.repo);

          const pgpUntrusted = goosemodScope$3.moduleStoreAPI.verifyPgp(repo).trustState === 'untrusted';

          if (pgpUntrusted) { // Repo PGP failed to verify and once had PGP success, refuse to update modules for this repo
            goosemodScope$3.showToast(`Failed to verify repo ${repo.meta.name}, refusing to update it's modules`, { timeout: 10000, type: 'error', subtext: 'GooseMod Store (PGP)' });
            repoPgpChecks[m.repo] = false;
            continue;
          }

          repoPgpChecks[m.repo] = true;
        }

        if (repoPgpChecks[m.repo] === false) continue; // Failed to verify PGP, skip

        // New update for it, cached JS != repo JS hashes
        if (shouldHandleLoadingText) goosemodScope$3.updateLoadingScreen(`Updating modules...\n${m}`);

        updatePromises.push(goosemodScope$3.moduleStoreAPI.importModule(m, goosemodScope$3.moduleSettingsStore.checkDisabled(m)).then(async () => {
          // goosemodScope.showToast(`Updated ${m}`, { timeout: 5000, type: 'success', subtext: 'GooseMod Store' });
        }));
      }

      await Promise.all(updatePromises);
    },

    initRepos: async () => {
      const getFirstMeta = async (url) => (await (await fetch(`${url}?_=${Date.now()}`)).json()).meta;
      const getFirstObj = async (url) => ({
        url,
        enabled: true,
        meta: await getFirstMeta(url)
      });

      goosemodScope$3.moduleStoreAPI.repos = JSON.parse(goosemod.storage.get('goosemodRepos')) || [
        await getFirstObj(`https://store.goosemod.com/goosemod.json`),
        await getFirstObj(`https://store.goosemod.com/ms2porter.json`),
        await getFirstObj(`https://store.goosemod.com/bdthemes.json`),
        await getFirstObj(`https://store.goosemod.com/pcthemes.json`),
        await getFirstObj(`https://store.goosemod.com/pcplugins.json`),
      ];
    },

    updateModules: async () => {
      let newModules = [];

      goosemodScope$3.moduleStoreAPI.repos = (await Promise.all(goosemodScope$3.moduleStoreAPI.repos.map(async (repo) => {
        if (!repo.enabled) {
          return repo;
        }

        try {
          const _resp = (await (await fetch(`${repo.url}?_=${Date.now()}`)).text());
          const resp = JSON.parse(_resp);

          const pgpUntrusted = await goosemodScope$3.moduleStoreAPI.verifyPgp(repo).trustState === 'untrusted';

          if (pgpUntrusted) {
            goosemodScope$3.showToast(`Failed to verify repo: ${repo.meta.name}, refusing to use new modules`, { timeout: 10000, type: 'error', subtext: 'GooseMod Store (PGP)' });

            newModules = newModules.concat(goosemodScope$3.moduleStoreAPI.modules.filter((x) => x.repo === repo.url)).sort((a, b) => a.name.localeCompare(b.name)); // Use cached / pre-existing modules

            return repo;
          }


          newModules = newModules.concat(resp.modules.map((x) => {
            x.repo = repo.url;
            return x;
          })).sort((a, b) => a.name.localeCompare(b.name));

          return {
            ...repo,
            meta: resp.meta, // Update meta,
            resp: _resp // Store raw response (PGP caching)
          };
        } catch (e) {
          goosemodScope$3.showToast(`Failed to get repo: ${repo.url}`, { timeout: 5000, type: 'error', subtext: 'GooseMod Store' }); // Show error toast to user so they know
          console.error(e);
        }

        return repo;
      }))).sort((a, b) => goosemodScope$3.moduleStoreAPI.repos.indexOf(a.url) - goosemodScope$3.moduleStoreAPI.repos.indexOf(b.url));

      goosemodScope$3.moduleStoreAPI.modules = newModules;

      goosemod.storage.set('goosemodRepos', JSON.stringify(goosemodScope$3.moduleStoreAPI.repos.map((x) => { delete x.resp; return x; }))); // Don't store raw responses
      goosemod.storage.set('goosemodCachedModules', JSON.stringify(goosemodScope$3.moduleStoreAPI.modules));
    },

    importModule: async (moduleName, disabled = false) => {
      try {
        const moduleInfo = goosemodScope$3.moduleStoreAPI.modules.find((x) => x.name === moduleName);

        const jsCode = await goosemodScope$3.moduleStoreAPI.jsCache.getJSForModule(moduleName);

        const calculatedHash = await sha512(jsCode);
        if (calculatedHash !== moduleInfo.hash) {
          goosemodScope$3.showToast(`Cancelled importing of ${moduleName} due to hash mismatch`, { timeout: 2000, type: 'danger', subtext: 'GooseMod Store' });

          console.warn('Hash mismatch', calculatedHash, moduleInfo.hash);
          return;
        }

        await goosemodScope$3.importModule({
          name: moduleName,
          data: jsCode,
          metadata: moduleInfo
        }, disabled);

        if (!disabled) {
          if (goosemodScope$3.modules[moduleName].goosemodHandlers.onLoadingFinished !== undefined) {
            await goosemodScope$3.modules[moduleName].goosemodHandlers.onLoadingFinished();
          }

          await goosemodScope$3.moduleSettingsStore.loadSavedModuleSetting(moduleName);
        }

        try {
          const item = goosemodScope$3.settings.items.find((x) => x[1] === goosemodScope$3.moduleStoreAPI.getSettingItemName(moduleInfo))[2].find((x) => x.subtext === moduleInfo.description);

          item.buttonType = 'danger';
          item.buttonText = goosemodScope$3.i18n.discordStrings.REMOVE;
          item.showToggle = true;
        } catch (e) {
          // goosemodScope.logger.debug('import', 'Failed to change setting during MS importModule (likely during initial imports so okay)');
        }

        // If themes / plugins open
        if (document.querySelector(`#gm-settings-inject`)) {
          const cardEls = [...document.querySelectorAll(`.title-31JmR4 + .colorStandard-2KCXvj`)].filter((x) => x.textContent === moduleInfo.description).map((x) => x.parentElement);

          if (cardEls.length === 0) return;

          for (const cardEl of cardEls) {
            const buttonEl = cardEl.querySelector(`.colorBrand-3pXr91`);

            buttonEl.className = buttonEl.className.replace('lookFilled-1Gx00P colorBrand-3pXr91', 'lookOutlined-3sRXeN colorRed-1TFJan');
            buttonEl.textContent = goosemodScope$3.i18n.discordStrings.REMOVE;

            const toggleEl = cardEl.querySelector(`.container-3auIfb`);
            toggleEl.classList.remove('hide-toggle');
          }
        }
      } catch (e) {
        goosemodScope$3.showToast(`Failed to import module ${moduleName}`, { timeout: 2000, type: 'error', subtext: 'GooseMod Store' });
        console.error(e);
      }
    },

    moduleRemoved: (m) => {
      let item = goosemodScope$3.settings.items.find((x) => x[1] === goosemodScope$3.moduleStoreAPI.getSettingItemName(m))[2].find((x) => x.subtext === m.description);
      
      if (item === undefined) return;

      item.buttonType = 'brand';
      item.buttonText = goosemodScope$3.i18n.goosemodStrings.moduleStore.card.button.import;
      item.showToggle = false;

      // If themes / plugins open
      if (document.querySelector(`#gm-settings-inject`)) {
        const cardEls = [...document.querySelectorAll(`.title-31JmR4 + .colorStandard-2KCXvj`)].filter((x) => x.textContent === m.description).map((x) => x.parentElement);

        if (cardEls.length === 0) return;

        for (const cardEl of cardEls) {
          const buttonEl = cardEl.querySelector(`.colorRed-1TFJan`);

          buttonEl.className = buttonEl.className.replace('lookOutlined-3sRXeN colorRed-1TFJan', 'lookFilled-1Gx00P colorBrand-3pXr91');
          buttonEl.textContent = goosemodScope$3.i18n.goosemodStrings.moduleStore.card.button.import;

          const toggleEl = cardEl.querySelector(`.container-3auIfb`);
          toggleEl.classList.add('hide-toggle');
        }
      }
    },

    parseAuthors: async (a) => {
      let authors = [];

      if (typeof a === "string") {
        authors = a.split(', ');
      } else if (Array.isArray(a)) {
        authors = a;
      }    
      return (await Promise.all(authors.map(async (x, i) => {
        if (typeof x === 'object') { // User object
          const pfp = `<img style="display: inline; border-radius: 50%; margin-right: 5px; vertical-align: bottom;" src="https://cdn.discordapp.com/avatars/${x.i}/${x.a}.png?size=32">`;
          const name = `<span class="author" style="cursor: pointer; line-height: 32px;" onmouseover="this.style.color = '#ccc'" onmouseout="this.style.color = '#fff'" onclick="try { window.goosemod.webpackModules.findByProps('open', 'fetchMutualFriends').open('${x.i}') } catch (e) { }">${x.n}</span>`; //<span class="description-3_Ncsb">#${result.discriminator}</span></span>`;

          return i > 1 ? pfp : pfp + name;
        }

        if (x.match(/^[0-9]{17,18}$/)) { // "<id>"
          const result = await getDataForID(x);

          const pfp = `<img style="display: inline; border-radius: 50%; margin-right: 5px; vertical-align: bottom;" src="https://cdn.discordapp.com/avatars/${result.id}/${result.avatar}.png?size=32">`;
          const name = `<span class="author" style="cursor: pointer; line-height: 32px;" onmouseover="this.style.color = '#ccc'" onmouseout="this.style.color = '#fff'" onclick="try { window.goosemod.webpackModules.findByProps('open', 'fetchMutualFriends').open('${result.id}') } catch (e) { }">${result.username}</span>`; //<span class="description-3_Ncsb">#${result.discriminator}</span></span>`;

          return i > 1 ? pfp : pfp + name;
        }

        let idMatch = x.match(/(.*) \(([0-9]{17,18})\)/); // "<name> (<id>)"
        if (idMatch === null) return `<span class="author">${x}</span>`; // "<name>"

        return `<span class="author" style="cursor: pointer;" onmouseover="this.style.color = '#ccc'" onmouseout="this.style.color = '#fff'" onclick="try { window.goosemod.webpackModules.findByProps('open', 'fetchMutualFriends').open('${idMatch[2]}') } catch (e) { }">${idMatch[1]}</span>`; // todo
      }))).join('<span class="description-3_Ncsb">,</span> ');
    },

    updateStoreSetting: async () => {
      let allItems = goosemodScope$3.settings.items.filter((x) => x[1] === goosemodScope$3.i18n.goosemodStrings.settings.itemNames.plugins || x[1] === goosemodScope$3.i18n.goosemodStrings.settings.itemNames.themes);

      for (const i of allItems) {
        i[2] = i[2].filter((x) => x.type !== 'card');
      }

      for (const m of goosemodScope$3.moduleStoreAPI.modules) {
        const itemName = goosemodScope$3.moduleStoreAPI.getSettingItemName(m);
        const item = allItems.find((x) => x[1] === itemName);

        const type = m.tags.includes('theme') ? 'themes' : 'plugins';

        item[2].push({
          type: 'card',
          
          tags: m.tags,
          github: m.github,
          images: m.images?.map((x) => {
            if (x.startsWith('/')) {
              const baseUrl = m.repo.split('/').slice(0, -1).join('/');
              x = baseUrl + x;
            }

            return x;
          }),
          lastUpdated: m.lastUpdated,

          buttonType: goosemodScope$3.modules[m.name] || goosemodScope$3.disabledModules[m.name] ? 'danger' : 'brand',
          showToggle: goosemodScope$3.modules[m.name] || goosemodScope$3.disabledModules[m.name],

          name: m.name,
          author: await goosemodScope$3.moduleStoreAPI.parseAuthors(m.authors),

          subtext: m.description,
          subtext2: m.version === '0' || m.version.toLowerCase().includes('auto') ? '' : `v${m.version}`,

          buttonText: goosemodScope$3.modules[m.name] || goosemodScope$3.disabledModules[m.name] ? goosemodScope$3.i18n.discordStrings.REMOVE : goosemodScope$3.i18n.goosemodStrings.moduleStore.card.button.import,
          onclick: async () => {
            goosemodScope$3.settings[`regen${type}`] = true;

            if (goosemodScope$3.modules[m.name] || goosemodScope$3.disabledModules[m.name]) {
              // el.textContent = goosemodScope.i18n.goosemodStrings.moduleStore.card.button.removing;

              goosemodScope$3.settings.removeModuleUI(m.name, itemName);

              return;
            }

            // el.textContent = goosemodScope.i18n.goosemodStrings.moduleStore.card.button.importing;

            if (m.dependencies && m.dependencies.length > 0) { // If it's the initial (on import) import that means it has been imported before
              const mainWord = m.dependencies.length === 1 ? 'dependency' : 'dependencies';

              const toContinue = await goosemod.confirmDialog('Continue',
                `${m.name} has ${m.dependencies.length === 1 ? 'a ' : ''}${mainWord}`,
                `**${m.name}** has **${m.dependencies.length}** ${mainWord}:
${m.dependencies.map((x) => ` - **${x}**\n`)}
To continue importing this module the dependencies need to be imported.`,
                undefined,
                'brand');

              if (!toContinue) return;

              for (const d of m.dependencies) {
                await goosemodScope$3.moduleStoreAPI.importModule(d);
              }
            }

            await goosemodScope$3.moduleStoreAPI.importModule(m.name);
          },
          isToggled: () => goosemodScope$3.disabledModules[m.name] === undefined,
          onToggle: async (checked) => {
            if (goosemodScope$3.settings.ignoreVisualToggle) {
              delete goosemodScope$3.settings.ignoreVisualToggle;
              return;
            }

            goosemodScope$3.settings[`regen${type}`] = true;

            if (checked) {
              goosemodScope$3.modules[m.name] = Object.assign({}, goosemodScope$3.disabledModules[m.name]);
              delete goosemodScope$3.disabledModules[m.name];

              await goosemodScope$3.modules[m.name].goosemodHandlers.onImport();

              if (goosemodScope$3.modules[m.name].goosemodHandlers.onLoadingFinished !== undefined) {
                await goosemodScope$3.modules[m.name].goosemodHandlers.onLoadingFinished();
              }

              await goosemodScope$3.moduleSettingsStore.loadSavedModuleSetting(m.name);

              goosemodScope$3.moduleSettingsStore.enableModule(m.name);
            } else {
              goosemodScope$3.disabledModules[m.name] = Object.assign({}, goosemodScope$3.modules[m.name]);

              await goosemodScope$3.modules[m.name].goosemodHandlers.onRemove();

              delete goosemodScope$3.modules[m.name];

              goosemodScope$3.moduleSettingsStore.disableModule(m.name);
            }

            // If themes / plugins open
            if (document.querySelector(`#gm-settings-inject`)) {
              const cardEls = [...document.querySelectorAll(`.title-31JmR4 + .colorStandard-2KCXvj`)].filter((x) => x.textContent === m.description).map((x) => x.parentElement);

              if (cardEls.length === 0) return;

              for (const cardEl of cardEls) {
                goosemodScope$3.settings.ignoreVisualToggle = true;

                const toggleInputEl = cardEl.querySelector('.input-rwLH4i');
                toggleInputEl.click();
              }
            }
          }
        });
      }
    },

    verifyPgp: async (repo) => {
      // if (useCache && Date.now() < repo.pgp?.when + (1000 * 60 * 60 * 24)) return repo.pgp.result; // If trying to verify and already cache in last day, return cache

      const setInRepo = (result) => { // Return wrapper also setting value in repo object to cache
        const pgpObj = {
          result,
          trustState: result !== 'verified' && repo.oncePgp || (result === 'invalid_signature' || result === 'no_signature') ? 'untrusted' : (result === 'verified' ? 'trusted' : 'unknown'),
          when: Date.now()
        };

        const storedRepo = goosemodScope$3.moduleStoreAPI.repos.find((x) => x.url === repo.url);
        if (!storedRepo) return pgpObj;

        storedRepo.pgp = pgpObj;

        if (result === 'verified') storedRepo.oncePgp = true; // Mark repo as once having PGP as if it doesn't in future it should be flagged

        goosemod.logger.debug('pgp.save', storedRepo);

        goosemod.storage.set('goosemodRepos', JSON.stringify(goosemodScope$3.moduleStoreAPI.repos));

        return storedRepo.pgp;
      };

      goosemod.logger.debug('pgp', 'verifying repo:', repo.meta.name);

      const get = async (url) => {
        const req = await fetch(url + '?_=' + Date.now()); // Add query to prevent caching

        if (!req.ok) return false;

        return await req.text();
      };

      const publicKey = await get(`https://goosemod.github.io/Keyserver/repos/${repo.meta.name}.gpg`);
      if (!publicKey) {
        goosemod.logger.debug('pgp', 'no public key, aborting');
        return setInRepo('no_public_key');
      }

      const signature = await get(repo.url + '.sig');
      if (!signature) {
        goosemod.logger.debug('pgp', 'no signature, aborting');
        return setInRepo('no_signature');
      }

      const original = repo.resp || await get(repo.url);

      return setInRepo(await verifySignature(publicKey, signature, original) ? 'verified' : 'invalid_signature');
    },
  };

  // Based on moduleStore/jsCache - make generic cache class in future as part of util?

  let goosemodScope$2 = {};

  const setThisScope$2 = (scope) => {
    goosemodScope$2 = scope;
  };

  const getCache = () => JSON.parse(goosemod.storage.get('goosemodi18nCache') || '{}');
  const purgeCache = () => goosemod.storage.remove('goosemodi18nCache');

  const updateCache = (lang, hash, goosemodStrings) => {
    let cache = getCache();

    cache[lang] = { hash, goosemodStrings };

    goosemod.storage.set('goosemodi18nCache', JSON.stringify(cache));
  };

  const geti18nData$1 = async (lang) => {
    const cache = getCache();

    if (cache[lang]) { // && moduleInfo.hash === cache[lang].hash) {
      return cache[lang].goosemodStrings;
    } else {
      const goosemodStrings = await goosemodScope$2.i18n.geti18nData(lang);
      const newHash = await sha512(JSON.stringify(goosemodStrings));

      updateCache(lang, newHash, goosemodStrings);

      return goosemodStrings;
    }
  };

  var Cache = {
    __proto__: null,
    setThisScope: setThisScope$2,
    getCache: getCache,
    purgeCache: purgeCache,
    updateCache: updateCache,
    geti18nData: geti18nData$1
  };

  const cache = Cache;

  let goosemodScope$1 = {};

  let forced = false;

  let goosemodStrings; // goosemod.i18n.strings
  let discordStrings;


  const setThisScope$1 = (scope) => {
    setThisScope$2(scope);

    goosemodScope$1 = scope;

    goosemodScope$1.i18nCheckNewLangInterval = setInterval(checkForNewLang, 1000);
  };

  const getDiscordLang = () => goosemodScope$1.webpackModules.findByProps('getLocaleInfo').getLocaleInfo();

  let lastLangCode;

  const checkForNewLang = async () => {
    if (forced) return; // If forced, ignore Discord lang

    const { code } = getDiscordLang();

    if (code === lastLangCode) return; // Lang not changed

    // goosemodScope.showToast(`New lang detected`);

    await updateExports(code);
  };

  const updateExports = async (code) => {
    lastLangCode = code;

    goosemodStrings = await geti18nData$1(code);

    const module = goosemodScope$1.webpackModules.findByProps('getLocaleInfo');

    const context = module._proxyContext || module._provider._context; // _proxyContext is old, not in Canary since 12th July

    discordStrings = {
      ...context.defaultMessages,
      ...context.messages  
    };
  };

  const geti18nData = async (lang = (getDiscordLang().code)) => {
    let json; // Undefined by default

    try {
      json = await (await fetch(`https://raw.githubusercontent.com/GooseMod/i18n/main/langs/${lang}.json`)).json();
    } catch (e) { // Likely no translation for language so fallback to en-US
      lang = `en-US`;

      console.log(`Failed to get GooseMod i18n data, falling back to ${lang}`, e);

      json = await (await fetch(`https://raw.githubusercontent.com/GooseMod/i18n/main/langs/${lang}.json`)).json();
    }

    return json;
  };

  const forceLang = async (code) => {
    if (code === 'Unspecified') {
      forced = false;
      await checkForNewLang();

      return;
    }

    forced = true;

    await updateExports(code);
  };

  var i18n = {
    __proto__: null,
    cache: cache,
    get forced () { return forced; },
    get goosemodStrings () { return goosemodStrings; },
    get discordStrings () { return discordStrings; },
    setThisScope: setThisScope$1,
    checkForNewLang: checkForNewLang,
    updateExports: updateExports,
    geti18nData: geti18nData,
    forceLang: forceLang
  };

  let css = '';
  let toSaveNext = false;

  const init$2 = () => {
    injectHooks();

    setInterval(() => { // Use interval to only save every 10s max
      if (!toSaveNext) return;
      toSaveNext = false;

      save();
    }, 10000);
  };

  const save = () => {
    [...document.body.classList].forEach((x) => { // A lot of (old) GM css relies on body classes for settings, so replace all body.<existing_class> to body
      css = css.replace(new RegExp(`body.${x}`, 'g'), `body`);
    });

    goosemod.storage.set('goosemodCSSCache', css);

    goosemod.showToast('Saved', { subtext: 'CSS Cache', type: 'debuginfo' });
  };

  const injectHooks = () => {
    const triggerSave = () => toSaveNext = true;

    const _insertRule = CSSStyleSheet.prototype.insertRule;
    const _appendChild = Node.prototype.appendChild;

    CSSStyleSheet.prototype.insertRule = function(cssText) {
      _insertRule.apply(this, arguments);

      if (!cssText.includes('body.')) return; // Most GM plugins which do insertRule use body class selectors, so make sure as we don't want to include Discord's dynamic styles

      css += cssText;
      triggerSave();
    };

    const elementsToAppendHook = [ document.body, document.head ];

    const hookElement = (parentEl) => {
      parentEl.appendChild = function (el) {
        _appendChild.apply(this, arguments);

        if (el.tagName === 'STYLE') { // Style element
          if (el.id.startsWith('ace')) return; // Ignore Ace editor styles

          hookElement(el); // Hook so future appends to the style are caught

          for (const t of el.childNodes) { // Catch current CSS
            css += t.textContent;
          }

          triggerSave();
        }

        if (el.data) { // Text node being appended to style
          css += el.textContent;

          triggerSave();
        }
      };
    };

    for (const el of elementsToAppendHook) {
      hookElement(el);
    }
  };

  const load = () => {
    const el = document.createElement('style');
    el.id = `gm-css-cache`;

    el.appendChild(document.createTextNode(goosemod.storage.get('goosemodCSSCache') || ''));

    document.body.appendChild(el);

    goosemod.showToast('Loaded', { subtext: 'CSS Cache', type: 'debuginfo' });

    init$2();
  };

  const removeStyle = () => {
    const el = document.getElementById(`gm-css-cache`);
    if (!el) return;

    el.remove();
  };

  var CSSCache = {
    __proto__: null,
    init: init$2,
    load: load,
    removeStyle: removeStyle
  };

  let goosemodScope = {};
  let unpatchers = [];

  let cssEl;

  const setThisScope = (scope) => {
    goosemodScope = scope;

    cssEl = document.createElement('style');

    cssEl.textContent = `
/* Custom title replacing "Server Boost" */
#gm-sponsor-modal .headerTitle-1_9Kor {
  background-image: url(https://goosemod.com/img/goose_gold.jpg);

  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50%;

  border-radius: 50%;

  height: 60px;
}

#gm-sponsor-modal .headerTitle-1_9Kor::after {
  font-family: var(--font-display);
  font-size: 24px;

  color: var(--text-normal);

  width: 140px;
  display: block;

  margin-left: 70px;
  margin-top: 6px;

  content: 'GooseMod Sponsor';
}

#gm-sponsor-modal .guildBackground-3UtSZ2 > svg:first-child { /* Hide Lottie hands animation */
  display: none;
}

#gm-sponsor-modal .contentWrapper-3INYJy {
  padding: 16px;
  padding-right: 8px;
}

#gm-sponsor-modal .contentWrapper-3INYJy > div > div:not(:last-child) {
  margin-bottom: 32px;
}

#gm-sponsor-modal .contentWrapper-3INYJy > div > .footer-2gL1pp {
  left: -16px;
  top: 16px;
  width: calc(100% - 8px);
}

#gm-sponsor-modal .contentWrapper-3INYJy > div > div:first-child {
  font-family: var(--font-primary);
  font-size: 16px;
  line-height: 20px;

  color: var(--text-normal);
}`;
  };

  const showSponsorModal = () => {
    const { React } = goosemodScope.webpackModules.common;

    const PremiumFeaturesList = goosemodScope.webpackModules.findByDisplayName('PremiumFeaturesList');
    const FeaturesClasses = goosemodScope.webpackModules.findByProps('roleIcon', 'profileBadgeIcon');
    const PersonShield = goosemodScope.webpackModules.findByDisplayName('PersonShield');

    const ModalComponents = goosemodScope.webpackModules.findByProps('ModalFooter');

    const { Button } = goosemodScope.webpackModules.findByPropsAll('Button')[1];
    const ButtonClasses = goosemodScope.webpackModules.findByProps('button', 'colorRed');

    const { PremiumGuildSubscriptionPurchaseModal } = goosemodScope.webpackModules.findByProps('PremiumGuildSubscriptionPurchaseModal');

    const parent = { default: PremiumGuildSubscriptionPurchaseModal };

    const makeIcon = (className, child = '') => (() => React.createElement('div', {
      style: {
        flexShrink: '0',
        marginRight: '10px',

        width: '24px',
        height: '24px'
      },

      className: FeaturesClasses[className]
    }, child));

    goosemodScope.patcher.patch(parent, 'default', ([ { onClose } ], res) => {
      res.props.id = 'gm-sponsor-modal';

      res.props.children[1].props.children = [];

      res.props.children[1].props.children.unshift(
        React.createElement('div', {
          
          },

          React.createElement('div', {}, `You can sponsor (donate regularly or one-time) GooseMod to help support it's development.`),

          React.createElement(PremiumFeaturesList, {
            columns: 2,
            features: [
              {
                description: 'Sponsor badge in GooseMod',
                overrideIcon: makeIcon('profileBadgeIcon')
              },
              {
                description: 'Sponsor role in GooseNest Discord',
                overrideIcon: makeIcon('roleIcon', React.createElement(PersonShield, { width: '24px', height: '24px' }))
              }
            ]
          }),

          React.createElement(ModalComponents.ModalFooter, {

            },

            React.createElement(Button, {
              color: ButtonClasses.colorBrand,

              type: 'submit',

              onClick: () => {
                window.open('https://github.com/sponsors/CanadaHonk'); // Open GitHub Sponsors link in user's browser

                onClose();
              }
            }, 'Sponsor'),

            React.createElement(Button, {
              color: ButtonClasses.colorPrimary,
              look: ButtonClasses.lookLink,

              type: 'button',

              onClick: () => {
                onClose();
              }
            }, 'Close')
          )
        )
      );

      return res;
    });

    const { openModal } = goosemodScope.webpackModules.findByProps('openModal');

    openModal((e) => React.createElement(parent.default, { ...e }));
  };

  const badgeUsers = {
    sponsor: [ // People sponsoring (donating money) to GooseMod / Ducko
      '506482395269169153', // Ducko
      '597905003717459968', // creatable
      '405400327370571786', // Chix
      '707309693449535599', // Armagan
      '302734867425132545', // hax4dayz
      '557429876618166283', // sourTaste000
      '250353310698176522', // p.marg
      '301088721984552961', // overheremedia / jakefaith
      '700698485560705084', // debugproto
      '274209973196816385', // quagsirus
      '274926795285987328', // Apollo
      '293094733159333889', // b1sergiu
      '202740603790819328', // Snow Fox / Lisa
      '541210648982585354', // Heli / heli_is_for_noob
    ],

    dev: [ // People actively developing GooseMod itself
      '506482395269169153', // Ducko
    ],

    translator: [ // People who have translated GooseMod to other languages
      '506482395269169153', // Ducko
      '394579914860396565', // C4Phoenix
      '787017887877169173', // Dziurwa
      '274213297316691968', // EnderXH
      '500656746440949761', // PandaDriver
      '326359466171826176', // sanana the skenana
      '396360155480064003', // Skree
      '169175121037099008', // TechnoJo4
      '189079074054995969', // xirreal
      '302734867425132545', // hax4dayz
      '172866400900218881', // Komodo
      '751092600890458203', // Pukima
      '266001128318042113', // maikirakiwi
    ]
  };

  const addBadges = () => {
    document.head.appendChild(cssEl);

    unpatchers.push(
      // User badges
      goosemodScope.patcher.userBadges.patch('GooseMod Sponsor',
        'https://goosemod.com/img/goose_gold.jpg',

        // Force check via query because Discord not properly rerendering
        () => goosemodScope.settings.gmSettings.get().gmBadges ? badgeUsers.sponsor : [],

        () => {
          showSponsorModal();
        },

        { round: true }
      ),

      goosemodScope.patcher.userBadges.patch('GooseMod Translator',
        'https://goosemod.com/img/goose_globe.png',

        // Force check via query because Discord not properly rerendering
        () => goosemodScope.settings.gmSettings.get().gmBadges ? badgeUsers.translator : [],

        () => {
          
        },

        { round: true }
      ),

      goosemodScope.patcher.userBadges.patch('GooseMod Developer',
        'https://goosemod.com/img/goose_glitch.jpg',

        // Force check via query because Discord not properly rerendering
        () => goosemodScope.settings.gmSettings.get().gmBadges ? badgeUsers.dev : [],

        () => {
          
        },

        { round: true }
      ),

      // Guild badges
      goosemod.patcher.guildBadges.patch('GooseMod Official Discord',
        'https://goosemod.com/img/logo.jpg',
      
        // Force check via query because Discord not properly rerendering
        () => goosemodScope.settings.gmSettings.get().gmBadges ? ['756146058320674998'] : [],
      
        () => {

        },
      
        { round: true }
      )
    );
  };

  const removeBadges = () => {
    for (const unpatch of unpatchers) {
      unpatch();
    }

    cssEl.remove();
  };

  var GMBadges = {
    __proto__: null,
    setThisScope: setThisScope,
    addBadges: addBadges,
    removeBadges: removeBadges
  };

  // Bypass to get Local Storage (Discord block / remove it) - Source / credit: https://stackoverflow.com/questions/52509440/discord-window-localstorage-is-undefined-how-to-get-access-to-the-localstorage
  function getLocalStoragePropertyDescriptor() {
    const frame = document.createElement('frame');
    frame.src = 'about:blank';

    document.body.appendChild(frame);

    let r = Object.getOwnPropertyDescriptor(frame.contentWindow, 'localStorage');

    frame.remove();

    return r;
  }

  var fixLocalStorage = () => {
    Object.defineProperty(window, 'localStorage', getLocalStoragePropertyDescriptor());
  };

  const init$1 = () => {
    fixLocalStorage();
  };
  const type$1 = 'LocalStorage';

  const set$1 = (key, value) => localStorage.setItem(key, value);

  const get$1 = (key) => localStorage.getItem(key);

  const remove$1 = (key) => localStorage.removeItem(key);

  const keys$1 = () => Object.keys(localStorage);

  var impl_localstorage = {
    __proto__: null,
    init: init$1,
    type: type$1,
    set: set$1,
    get: get$1,
    remove: remove$1,
    keys: keys$1
  };

  let storageCache = {};

  const type = 'Extension';

  document.addEventListener('gmes_get_return', ({ detail }) => {
    storageCache = detail;
  }, { once: true });

  document.dispatchEvent(new CustomEvent('gmes_get'));

  const set = (key, value) => {
    storageCache[key] = value;
    document.dispatchEvent(new CustomEvent('gmes_set', { detail: { key, value } }));
  };

  const get = (key) => storageCache[key] || null;

  const remove = (key) => {
    delete storageCache[key];
    document.dispatchEvent(new CustomEvent('gmes_remove', { detail: { key } }));
  };

  const keys = () => Object.keys(storageCache);

  var impl_extension = {
    __proto__: null,
    type: type,
    set: set,
    get: get,
    remove: remove,
    keys: keys
  };

  // If extension version isn't defined, use localStorage
  const impl = !window.gmExtension ? impl_localstorage : impl_extension;

  if (impl.init) impl.init();

  var _Card = () => {
  const { React } = goosemod.webpackModules.common;

  const Button = goosemod.webpackModules.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');
  const Switch = goosemod.webpackModules.findByDisplayName('Switch');

  const Markdown = goosemod.webpackModules.findByDisplayName('Markdown');
  const FormText = goosemod.webpackModules.findByDisplayName('FormText');

  const FormTextClasses = goosemod.webpackModules.findByProps('formText', 'placeholder');
  const FormClasses = goosemod.webpackModules.findByProps('title', 'dividerDefault');

  const ModalHandler = goosemod.webpackModules.findByProps('openModal');
  const SmallMediaCarousel = goosemod.webpackModules.findByDisplayName('SmallMediaCarousel');

  const Discord = goosemod.webpackModules.findByDisplayName('Discord');


  return class Card extends React.PureComponent {
    render() {
      if (this.props.checked !== this.props.isToggled()) {
        this.props.checked = this.props.isToggled();
      }

      return React.createElement('div', {
        className: ['gm-store-card', this.props.mini ? 'gm-store-card-mini' : '', ...this.props.tags.map((x) => x.replace(/ /g, '|'))].join(' '),
        onClick: this.props.onClick
      },

        React.createElement('div', {
          style: {
            backgroundImage: this.props.images?.length ? `url("${this.props.images[0]}")` : ''
          },

          onClick: () => {
            if (!this.props.images?.length) return; // Ignore if no images

            ModalHandler.openModal(() => React.createElement('div', {
              className: 'gm-carousel-modal'
            },
              React.createElement(SmallMediaCarousel, {
                items: this.props.images.map((x) => ({ type: 1, src: x })),
                autoplayInterval: 5000 // Time between automatically cycling to next image
              })
            ));
          }
        }, this.props.images?.length ? '' : 'No Preview'),

        React.createElement('div', {
          className: [FormClasses.title, !this.props.author.includes('avatar') ? 'no-pfp' : ''].join(' '),

          ref: (ref) => {
            if (!ref) return;
            ref.innerHTML = this.props.author;
          }
        }),

        React.createElement('div', {
          className: FormClasses.title,
        }, this.props.name),

        React.createElement(FormText, {
          className: this.props.name ? FormTextClasses.description : ''
        }, React.createElement(Markdown, {
          className: 'gm-settings-note-markdown'
        }, this.props.subtext)),

        React.createElement('div', {
          
        },
          this.props.github ? React.createElement(FormText, {
            className: FormTextClasses.description
          },
            React.createElement('span', {

            }, this.props.github.stars),

            React.createElement('svg', {
              width: '16',
              height: '16',
              viewBox: '0 0 24 24',
              fill: 'currentColor'
            },
              React.createElement('path', {
                d: 'M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z'
              })
            )
          ) : React.createElement('div'),

          React.createElement(FormText, {
            className: FormTextClasses.description
          }, this.props.subtext2)
        ),

        React.createElement('div', {

        },
          React.createElement(Button, {
            color: this.props.buttonType === 'danger' ? Button.Colors.RED : Button.Colors.BRAND,
            look: this.props.buttonType === 'danger' ? Button.Looks.OUTLINED : Button.Looks.FILLED,

            size: Button.Sizes.SMALL,

            onClick: () => {
              this.props.onclick();
            }
          }, this.props.buttonText),

          this.props.github ? React.createElement(Button, {
            color: Button.Colors.GREY,
            size: Button.Sizes.SMALL,

            onClick: () => {
              window.open(`https://github.com/${this.props.github.repo}`);
            }
          },
            React.createElement('svg', {
              width: '24',
              height: '24',
              viewBox: '0 0 24 24',
              fill: 'currentColor'
            },
              React.createElement('path', {
                d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
              })
            )
          ) : null,

          this.props.discordMessage ? React.createElement(Button, {
            color: Button.Colors.GREY,
            size: Button.Sizes.SMALL,

            onClick: () => {
              const { transitionTo } = goosemod.webpackModules.findByProps('transitionTo');
              const { jumpToMessage } = goosemod.webpackModules.findByProps('jumpToMessage');

              transitionTo(`/channels/${this.props.discordMessage.guild}/${this.props.discordMessage.channel}`);
              jumpToMessage({ channelId: this.props.discordMessage.channel, messageId: this.props.discordMessage.message, flash: true });
            }
          },
            React.createElement(Discord, {
              width: '24',
              height: '24',
            })
          ) : null,

          React.createElement(Switch, {
            className: !this.props.showToggle ? 'hide-toggle' : '',

            checked: this.props.checked,
            disabled: false,

            onChange: (x) => {
              this.props.checked = !this.props.checked;

              this.forceUpdate();

              this.props.onToggle(this.props.checked);
            }
          })
        )
      );
    }
  }
  };

  var card = {
    __proto__: null,
    'default': _Card
  };

  var ProfileStoreInit = () => {
    const { React, ReactDOM } = goosemod.webpackModules.common;
      
    const UserProfileModal = goosemod.webpackModules.find((x) => x.default?.displayName === 'UserProfileModal');

    const ScrollerClasses = goosemod.webpackModules.findByProps('auto', 'scrollerBase');

    goosemod.patcher.patch(UserProfileModal, 'default', (_args, res) => {
      const UserProfileTabBar = goosemod.reactUtils.findInReactTree(res.props.children, (x) => x.props?.section);
      if (!UserProfileTabBar) return;
      
      goosemod.patcher.patch(UserProfileTabBar, 'type', ([ { user: { id } } ], res) => {
        const modules = goosemod.moduleStoreAPI.modules.filter((x) => x.authors.some && x.authors.some((x) => x.i === id));

        if (modules.length === 0) return;
        
        const themesItem = goosemod.settings.items.find((x) => x[1] === goosemod.i18n.goosemodStrings.settings.itemNames.themes)[2];
        const pluginsItem = goosemod.settings.items.find((x) => x[1] === goosemod.i18n.goosemodStrings.settings.itemNames.plugins)[2];
        
        const themes = modules.filter((x) => x.tags.includes('theme'));
        const plugins = modules.filter((x) => !x.tags.includes('theme'));
        
        
        const tabbar = res.props.children;
        const baseOff = tabbar.props.children[0];

        const makeCard = (module) => React.createElement(_Card, {
          ...module,
          mini: true,

          onClick: async () => {
            document.querySelector('.backdrop-1wrmKB').click(); // Hide user profile modal

            const RoutingUtils = goosemod.webpackModules.findByProps('transitionTo');

            RoutingUtils.transitionTo('/channels/@me'); // Go to home

            await sleep(200);

            document.getElementById('gm-home-' + (module.tags.includes('theme') ? 'themes' : 'plugins')).click(); // Go to GM Store themes / plugins page

            await sleep(200);

            const cardEl = [...document.querySelectorAll(`.title-31JmR4 + .colorStandard-2KCXvj`)].filter((x) => x.textContent === module.subtext).pop().parentElement;

            document.querySelector('#gm-settings-inject').scrollTo({ top: cardEl.offsetTop - 12, behavior: 'smooth' }); // Scroll to card smoothly

            cardEl.style.boxShadow = '0 0 12px 6px rgb(88 101 242 / 30%)'; // Highlight with message highlight color (improve in future likely)
          }
        });
        
        goosemod.patcher.patch(tabbar.props, 'onItemSelect', ([ selected ]) => {
          if (!selected.startsWith('GM_')) return;
          
          setTimeout(() => {
            const target = document.querySelector(`.body-r6_QPy > :first-child`);
            
            ReactDOM.render(React.createElement('div', {
              className: [ScrollerClasses.auto, 'gm-modules-container'].join(' ')
            },
              ...themes.map((x) => themesItem.find((y) => y.name === x.name)).map((x) => makeCard(x)),
              ...plugins.map((x) => pluginsItem.find((y) => y.name === x.name)).map((x) => makeCard(x)),
            ), target);
          }, 1);
        });
        
        tabbar.props.children.push(React.cloneElement(baseOff, {
          id: 'GM_MODULES'
        }, 'GooseMod Modules'));
        
        return res;
      });
    });
  };

  const scopeSetterFncs = [
    setThisScope$8,
    setThisScope$7,
    setThisScope$6,

    moduleStoreAPI.setThisScope,

    setThisScope$b,
    setThisScope$a,

    setThisScope$9,
    setThisScope$f,
    setThisScope$d,

    setThisScope$5,

    setThisScope$c,

    setThisScope$1,

    setThisScope
  ];

  const importsToAssign = {
    startLoadingScreen,
    stopLoadingScreen,
    updateLoadingScreen,

    settings: Settings,

    importModule,

    moduleSettingsStore: ModuleSettingsStore,

    webpackModules: WebpackModules,
    logger: Logger,

    showToast,
    confirmDialog: show$1,
    moduleStoreAPI,

    changelog: Changelog,
    goosemodChangelog: GoosemodChangelog,

    packModal: PackModal,

    patcher: Patcher,
    attrs: Attrs,
    reactUtils: ReactUtils,

    i18n,

    cssCache: CSSCache,

    gmBadges: GMBadges,

    ootb: OOTB,
    storage: impl
  };

  const init = async function () {
    Object.assign(this, importsToAssign);

    this.cssCache.load();

    while (document.querySelectorAll('.flex-1xMQg5.flex-1O1GKY.horizontal-1ae9ci.horizontal-2EEEnY.flex-1O1GKY.directionRow-3v3tfG.justifyStart-2NDFzi.alignStretch-DpGPf3.noWrap-3jynv6 > [type="button"]:last-child').length === 0 || window.webpackJsonp === undefined) {
      await sleep(10);
    }

    for (let x of scopeSetterFncs) {
      await x(this);
    }

    this.versioning = {
      version: `11.1`,
      hash: '8670e936b7428386cd7588939d3988224b758707', // Hash of built final js file is inserted here via build script

      lastUsedVersion: this.storage.get('goosemodLastVersion')
    };

    this.versioning.isDeveloperBuild = this.versioning.hash === '<hash>';

    this.storage.set('goosemodLastVersion', this.versioning.version);

    this.logger.debug('import.version.goosemod', `${this.versioning.version} (${this.versioning.hash})`);

    if (window.DiscordNative !== undefined) this.logger.debug('import.version.discord', `${DiscordNative.app.getReleaseChannel()} ${DiscordNative.app.getVersion()}`);
    
    if (window.gmUntethered) {
      this.untetheredVersion = window.gmUntethered.slice();
    }

    if (this.versioning.lastUsedVersion && this.versioning.version !== this.versioning.lastUsedVersion) {
      this.goosemodChangelog.show(); // Show changelog if last GooseMod version is different than this version
    }

    this.startLoadingScreen();

    this.updateLoadingScreen('Getting i18n data...');
    await this.i18n.checkForNewLang();

    this.updateLoadingScreen('Initialising internals...');

    let toInstallModules = Object.keys(JSON.parse(this.storage.get('goosemodModules')) || {});
    let disabledModules = Object.keys(JSON.parse(this.storage.get('goosemodDisabled')) || {});

    this.modules = toInstallModules.filter((x) => disabledModules.indexOf(x) === -1).reduce((acc, v) => { acc[v] = { goosemodHandlers: { } }; return acc; }, {});
    this.disabledModules = toInstallModules.filter((x) => disabledModules.indexOf(x) !== -1).reduce((acc, v) => { acc[v] = { goosemodHandlers: { } }; return acc; }, {});

    this.moduleStoreAPI.modules = JSON.parse(this.storage.get('goosemodCachedModules')) || [];
    this.moduleStoreAPI.modules.cached = true;
    
    this.settings.makeGooseModSettings();

    await this.moduleStoreAPI.initRepos();

    this.removed = false;

    if (!this.storage.get('goosemodCachedModules')) { // If not cached, fetch latest repos
      await this.moduleStoreAPI.updateModules(true);
    }


    let toInstallIsDefault = false;
    
    if (toInstallModules.length === 0) {
      toInstallIsDefault = true;
    }

    toInstallModules = toInstallModules.filter((m) => this.moduleStoreAPI.modules.find((x) => x.name === m) !== undefined);
    
    let themeModule = toInstallModules.find((x) => x.toLowerCase().includes('theme'));
    
    if (themeModule) {
      toInstallModules.unshift(toInstallModules.splice(toInstallModules.indexOf(themeModule), 1)[0]);
    }
    
    let hardcodedColorFixerModule = toInstallModules.find((x) => x === 'Hardcoded Color Fixer');
    
    if (hardcodedColorFixerModule) {
      toInstallModules.unshift(toInstallModules.splice(toInstallModules.indexOf(hardcodedColorFixerModule), 1)[0]);
    }

    if (toInstallIsDefault) {
      // await this.packModal.ask();
      toInstallModules = ['Fucklytics', 'Custom CSS']; // Base modules
    }

    this.updateLoadingScreen('Importing modules from Store...');

    const importPromises = [];

    for (let m of toInstallModules) {
      // await this.moduleStoreAPI.importModule(m);
      importPromises.push(this.moduleStoreAPI.importModule(m, disabledModules.includes(m)));
    }

    await Promise.all(importPromises);


    this.cssCache.removeStyle();

    if (this.settings.gmSettings.get().gmBadges) this.gmBadges.addBadges();
    if (this.settings.gmSettings.get().attrs) this.attrs.patch();
    
    this.saveInterval = setInterval(() => {
      this.moduleSettingsStore.saveModuleSettings();
    }, 3000);
    
    this.remove = () => {
      this.settingsUninjects.forEach((x) => x());

      clearInterval(this.saveInterval);
      clearInterval(this.i18nCheckNewLangInterval);
      clearInterval(this.hotupdateInterval);
      
      this.storage.keys().filter((x) => x.toLowerCase().startsWith('goosemod')).forEach((x) => this.storage.remove(x));
      
      this.removed = true;
      
      for (let p in this.modules) {
        if (this.modules.hasOwnProperty(p) && this.modules[p].goosemodHandlers.onRemove !== undefined) {
          try {
            this.modules[p].goosemodHandlers.onRemove();
          } catch (e) { }
        }
      }
    };

    this.moduleStoreAPI.hotupdate(true);

     // Hotupdate every hour
    this.hotupdateInterval = setInterval(() => {
      if (!this.settings.gmSettings.get().autoupdate) return; // Check main GM setting

      this.moduleStoreAPI.hotupdate();
    }, 1000 * 60 * 60);
    
    this.stopLoadingScreen();
    
    if (this.settings.isSettingsOpen()) { // If settings are open, reopen to inject new GooseMod options
      this.settings.reopenSettings();
    }

    if (!this.storage.get('goosemodOOTB')) { // First time install
      await sleep(1000); // Wait for slowdown / Discord loading to ease

      while (document.querySelector('.modal-3O0aXp')) { // Wait for modals to close (GM changelog, etc)
        await sleep(100);
      }

      this.ootb.start();

      this.storage.set('goosemodOOTB', true);
    }


    ProfileStoreInit();
  };

  window.goosemod = {};
  init.bind(window.goosemod)();

  var modulesPreview = () => {
  const { React } = goosemod.webpackModules.common;

  const DiscoverStaticGuildCard = goosemod.webpackModules.findByDisplayName('DiscoverStaticGuildCard');

  const baseImages = (m) => m.images?.map((x) => {
    if (x.startsWith('/')) {
      const baseUrl = m.repo.split('/').slice(0, -1).join('/');
      x = baseUrl + x;
    }

    return x;
  });

  return class ModulesPreview extends React.PureComponent {
    render() {
      setTimeout(() => {
        try {
          const splashes = document.querySelectorAll('.discoverPreview-3q1szX .splashImage-352DQ1');

          splashes[splashes.length - 3].src = baseImages(this.props.modules[1])[0];
          splashes[splashes.length - 2].src = baseImages(this.props.modules[0])[0];
          splashes[splashes.length - 1].src = baseImages(this.props.modules[2])[0];
        } catch (e) { // Probably has no images array so ignore

        }
      }, 100);

      return React.createElement('div', {
        className: 'discoverPreview-3q1szX gm-modules-preview'
      },
        React.createElement(DiscoverStaticGuildCard, {
          className: 'placeholderCard-3Zu1qO',

          disabled: true,
          small: true,
          loading: false,

          guild: {
            banner: null,
            splash: null,
            discoverySplash: null,
            icon: null,
            id: null,
            memberCount: null,
            presenceCount: null,
            ...this.props.modules[1] // name, description
          }
        }),

        React.createElement(DiscoverStaticGuildCard, {
          className: 'placeholderCard-3Zu1qO',

          guild: {
            banner: null,
            splash: null,
            discoverySplash: null,
            icon: null,
            id: null,
            memberCount: null,
            presenceCount: null,
            ...this.props.modules[0] // name, description
          }
        }),

        React.createElement(DiscoverStaticGuildCard, {
          className: 'placeholderCard-3Zu1qO',

          disabled: true,
          small: true,
          loading: false,

          guild: {
            banner: null,
            splash: null,
            discoverySplash: null,
            icon: null,
            id: null,
            memberCount: null,
            presenceCount: null,
            ...this.props.modules[2] // name, description
          }
        })
      );
    }
  }
  };

  var modulesPreview$1 = {
    __proto__: null,
    'default': modulesPreview
  };

  var openReposModal = async () => {
    const { React } = goosemod.webpackModules.common;

    const SwitchItem = goosemod.webpackModules.findByDisplayName('SwitchItem');
    
    class SwitchItemContainer extends React.Component {
      constructor(props) {
        const originalHandler = props.onChange;
        props.onChange = (e) => {
          originalHandler(e);

          this.props.value = e;
          this.forceUpdate();
        };

        super(props);
      }

      render() {
        //this.props._onRender(this);
        return React.createElement('div', {},
          React.createElement(Button, {
            style: {
              width: '92px',
              
              position: 'absolute',
              right: '10px',
              marginTop: '33px'
            },

            color: ButtonClasses['colorRed'],
            size: ButtonClasses['sizeSmall'],

            onClick: this.props.buttonOnClick
          }, goosemod.i18n.discordStrings.REMOVE),

          React.createElement(SwitchItem, {
            ...this.props
          })
        );
      }
    }

    let modalCloseHandler = undefined;
    const updateAfterChange = async () => {
      await goosemod.moduleStoreAPI.updateModules();

      await goosemod.moduleStoreAPI.updateStoreSetting();

      document.querySelector(`.selected-aXhQR6`).click();
    };

    const restartModal = async () => {
      modalCloseHandler();

      await updateAfterChange();

      openReposModal();
    };

    const { Button } = goosemod.webpackModules.findByProps('Button');
    const ButtonClasses = goosemod.webpackModules.findByProps('button', 'colorRed');

    const ModalStuff = goosemod.webpackModules.findByProps('ModalRoot');
    const ChangelogModalClasses = goosemod.webpackModules.findByProps('socialLink', 'date');

    const Header = goosemod.webpackModules.findByDisplayName('Header');
    const Text = goosemod.webpackModules.findByDisplayName('Text');

    const { openModal } = goosemod.webpackModules.findByProps("openModal");

    const Flex = goosemod.webpackModules.findByDisplayName('Flex');
    const TextInput = goosemod.webpackModules.findByDisplayName('TextInput');

    const Tooltip = goosemod.webpackModules.findByDisplayName('Tooltip');
    const FlowerStar = goosemod.webpackModules.findByDisplayName('FlowerStar');

    const Verified = goosemod.webpackModules.findByDisplayName('Verified');
    // const Help = goosemod.webpackModules.findByDisplayName('Help');
    const Alert = goosemod.webpackModules.findAll((x) => x.displayName === 'Alert').pop(); // Discord has 2 components with "Alert" displayName

    const openReposModal = () => {
      const repoEls = [];
      let repoInd = 0;

      for (const repo of goosemod.moduleStoreAPI.repos) {
        const children = [
          repo.meta.name
        ];

        if (repo.pgp?.trustState) {
          let tooltip = '';
          let icon = null;

          switch (repo.pgp.trustState) {
            case 'trusted':
              tooltip = 'PGP Verified';

              icon = React.createElement(Verified, {
                className: "icon-1ihkOt"
              });

              break;

            case 'untrusted':
              tooltip = 'PGP Untrusted';

              icon = React.createElement(Alert, {
                className: "icon-1ihkOt"
              });

              break;

            case 'unknown':
              tooltip = 'No PGP';

              icon = React.createElement(Alert, {
                className: "icon-1ihkOt"
              });

              break;
          }

          children.unshift(React.createElement('span', {
            style: {
              display: 'inline-flex',
              position: 'relative',
              top: '2px',
              marginRight: '4px'
            }
          }, React.createElement(Tooltip, {
            position: 'top',
            color: 'primary',

            text: tooltip
          }, ({
            onMouseLeave,
            onMouseEnter
          }) =>
            React.createElement(FlowerStar, {
              className: `gm-repos-modal-icon-${icon.type.displayName}`,
              'aria-label': tooltip,

              onMouseEnter,
              onMouseLeave
            },
              icon
            )
          )));
        }

        repoEls.push(React.createElement(SwitchItemContainer, {
          style: {
            marginTop: repoInd === 0 ? '16px' : ''
          },

          note: repo.meta.description,
          value: repo.enabled,

          onChange: (e) => {
            repo.enabled = e;

            updateAfterChange();
          },

          buttonOnClick: async () => {
            goosemod.moduleStoreAPI.repos.splice(goosemod.moduleStoreAPI.repos.indexOf(repo), 1);

            restartModal();
          }
        }, ...children));

        repoInd++;
      }

      let currentNewRepoInput = '';

      openModal((e) => {
        modalCloseHandler = e.onClose;

        return React.createElement(ModalStuff.ModalRoot, {
            transitionState: e.transitionState,
            size: 'medium'
          },
          React.createElement(ModalStuff.ModalHeader, {},
            React.createElement(Flex.Child, {
              basis: 'auto',
              grow: 1,
              shrink: 1,
              wrap: false,
            },
              React.createElement(Header, {
                tag: 'h2',
                size: Header.Sizes.SIZE_20
              }, goosemod.i18n.goosemodStrings.moduleStore.repos.repos),

              React.createElement(Text, {
                size: Text.Sizes.SIZE_12,
                className: ChangelogModalClasses.date
              },
                goosemod.moduleStoreAPI.modules.filter((x) => x.tags.includes('theme')).length, ' Themes', ', ',
                goosemod.moduleStoreAPI.modules.filter((x) => !x.tags.includes('theme')).length, ' Plugins', ', ',
                Object.keys(goosemod.moduleStoreAPI.modules.reduce((acc, x) => { let a = x.authors; if (!a.forEach) a = [ a ]; a.forEach((y) => acc[y.n || y.match(/(.*) \(([0-9]{17,18})\)/)?.[1] || y] = true); return acc; }, {})).length, ' Developers'
              )
            ),
            React.createElement('FlexChild', {
                basis: 'auto',
                grow: 0,
                shrink: 1,
                wrap: false
              },
              React.createElement(ModalStuff.ModalCloseButton, {
                onClick: e.onClose
              })
            )
          ),

          React.createElement(ModalStuff.ModalContent, {},
            ...repoEls,
            React.createElement(Flex, {
                style: {
                  marginBottom: '16px'
                },

                basis: 'auto',
                grow: 1,
                shrink: 1
              },

              React.createElement(TextInput, {
                className: 'codeRedemptionInput-3JOJea',
                placeholder: 'https://example.com/modules.json',
                onChange: (e) => {
                  currentNewRepoInput = e;
                },
              }),

              React.createElement(Button, {
                style: {
                  width: '112px'
                },
                // color: ButtonClasses['colorBrand']
                size: ButtonClasses['sizeMedium'],
                onClick: async () => {
                  let resp = {};
                  try {
                    resp = await (await fetch(currentNewRepoInput)).json();
                  } catch (e) {
                  }

                  if (resp.meta?.name === undefined) {
                    goosemod.showToast(`Invalid Repo`, { type: 'error', timeout: 5000, subtext: 'GooseMod Store' });

                    return;
                  }

                  const confirmExternal = confirm(`External repos pose security risks as they are not controlled by GooseMod developers. We are not responsible for any dangers because of external repos added by users.\n\nIf you do not trust the owner of this repo do not use it as it could compromise your Discord install.\n\nPlease confirm adding this repo by pressing OK.`);
                  if (!confirmExternal) {
                    goosemod.showToast(`Cancelled Adding Repo`, { type: 'danger', timeout: 5000, subtext: 'Refused Security Prompt' });

                    return;
                  }

                  const repo = {
                    url: currentNewRepoInput,
                    meta: resp.meta,
                    enabled: true
                  };

                  const pgpResult = await goosemod.moduleStoreAPI.verifyPgp(repo, false);

                  if (pgpResult.trustState === 'untrusted') { // Refuse untrusted (PGP fail)
                    goosemod.showToast(`Cancelled Adding Repo`, { type: 'danger', timeout: 5000, subtext: 'PGP Untrusted Failure' });

                    return;
                  }

                  if (pgpResult.trustState !== 'trusted' && !confirm(`This repo is not known or trusted (no PGP verification), please be extra careful. Make sure you trust the owner(s) of this repo completely.\n\nTo solve this issue ask the repo maintainer to add PGP support.\n\nPlease reconfirm adding this repo by pressing OK.`)) { // Warn again with no PGP
                    goosemod.showToast(`Cancelled Adding Repo`, { type: 'danger', timeout: 5000, subtext: 'Refused Security Prompt' });

                    return;
                  }


                  goosemod.moduleStoreAPI.repos.push(repo);

                  restartModal();
                }
              }, goosemod.i18n.discordStrings.ADD)
            )
          )
        );
      });
    };

    openReposModal();
  };

  var header$2 = () => {
  const { React } = goosemod.webpackModules.common;

  const HomeMiscClasses = goosemod.webpackModules.findByProps('headerBarContainer', 'pageContent');
  const SpinClasses = goosemod.webpackModules.findByProps('updateAvailable');
  const IconClasses = goosemod.webpackModules.findByProps('icon', 'iconBadge', 'title');

  const UpdateIcon = React.createElement(goosemod.webpackModules.findByDisplayName('Retry'), {
    width: 24,
    height: 24,

    className: IconClasses.icon
  });

  const ReposIcon = React.createElement(goosemod.webpackModules.findByDisplayName('Cloud'), {
    width: 24,
    height: 24,

    className: IconClasses.icon
  });

  const HeaderBarContainer = goosemod.webpackModules.findByDisplayName('HeaderBarContainer');

  const TabBar = goosemod.webpackModules.findByDisplayName('TabBar');
  const TabBarClasses1 = goosemod.webpackModules.findByProps('topPill');
  const TabBarClasses2 = goosemod.webpackModules.findByProps('tabBar', 'nowPlayingColumn');

  const tabsSelected = {
    themes: 'STORE',
    plugins: 'STORE'
  };


  return class Header extends React.PureComponent {
    constructor(props) {
      super(props);
    }

    render() {
      return React.createElement(HeaderBarContainer, {
        className: HomeMiscClasses.headerBarContainer,

        isAuthenticated: true,
        transparent: false
      },

      React.createElement(HeaderBarContainer.Icon, {
        icon: () => this.props.icon,
        className: IconClasses.icon
      }),

      React.createElement(HeaderBarContainer.Title, {}, goosemod.i18n.goosemodStrings.settings.itemNames[this.props.title] || (this.props.title[0].toUpperCase() + this.props.title.substring(1))),

      tabsSelected[this.props.title] ? React.createElement(HeaderBarContainer.Divider) : null,

      tabsSelected[this.props.title] ? React.createElement(TabBar, {
        selectedItem: tabsSelected[this.props.title],

        type: TabBarClasses1.topPill,
        className: TabBarClasses2.tabBar,

        onItemSelect: (x) => {
          tabsSelected[this.props.title] = x;
          this.forceUpdate();

          setTimeout(goosemod.settings.updateModuleStoreUI, 10);
        }
      },
        React.createElement(TabBar.Item, {
          id: 'STORE',
          look: 0,
          
          className: TabBarClasses2.item
        }, 'Store'),
        React.createElement(TabBar.Item, {
          id: 'IMPORTED',
          look: 0,
          
          className: TabBarClasses2.item
        }, 'Imported'),
      ) : null,


      this.props.title !== 'snippets' ? React.createElement('div', {
        className: IconClasses.toolbar,

        style: {
          position: 'absolute',
          right: '0px'
        }
      },
        React.createElement(HeaderBarContainer.Icon, {
          icon: () => UpdateIcon,

          tooltip: goosemod.i18n.discordStrings.STAGE_DISCOVERY_REFRESH_ICON_LABEL,

          onClick: async () => {
            const svgEl = document.querySelector(`.${IconClasses.toolbar} > [role="button"] > svg`);
            svgEl.classList.add(SpinClasses.updateAvailable);

            await goosemod.moduleStoreAPI.hotupdate(true);

            document.querySelector(`.selected-aXhQR6`).click();
          }
        }),
        React.createElement(HeaderBarContainer.Icon, {
          icon: () => ReposIcon,

          tooltip: goosemod.i18n.goosemodStrings.moduleStore.repos.repos,

          onClick: openReposModal
        })
      ) : ''
      );
    }
  }
  };

  var header$3 = {
    __proto__: null,
    'default': header$2
  };

  var _Divider = () => {
  const { React } = goosemod.webpackModules.common;

  const FormDivider = goosemod.webpackModules.findByDisplayName('FormDivider');
  const SettingsFormClasses = goosemod.webpackModules.findByProps('dividerDefault', 'titleDefault');

  return class Divider extends React.PureComponent {
    render() {
      return React.createElement(FormDivider, {
        className: SettingsFormClasses.dividerDefault
      });
    }
  }
  };

  var divider = {
    __proto__: null,
    'default': _Divider
  };

  var header = () => {
  const { React } = goosemod.webpackModules.common;

  const FormTitle = goosemod.webpackModules.findByDisplayName('FormTitle');

  const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');

  const Tooltip = goosemod.webpackModules.findByDisplayName('Tooltip');
  const Science = goosemod.webpackModules.findByDisplayName('Science');


  return class Header extends React.PureComponent {
    constructor(props) {
      if (props.experimental) {
        props.text = [
          React.createElement(Tooltip, {
            position: 'top',
            color: 'primary',

            text: 'Experimental',
          }, ({
            onMouseLeave,
            onMouseEnter
          }) =>
            React.createElement(Science, {
              width: 18,
              height: 18,

              className: 'gm-settings-label-icon',

              onMouseLeave,
              onMouseEnter
            })
          ),

          React.createElement('span', {
            style: {
              verticalAlign: 'unset'
            },

            className: 'gm-settings-label-text'
          }, props.text)
        ];
      }

      props.id = `gm-settings-header-${Math.random().toString().substring(2)}`;
      props.collapsed = false;

      super(props);

      this.props.handleCollapse = () => {
        const after = [...document.querySelectorAll(`#${this.props.id} ~ *`)];

        const headerChildren = after.slice(0, after.indexOf(after.find((x) => x.tagName === 'H5')));

        for (const child of headerChildren) {
          child.style.display = this.props.collapsed ? 'none' : '';
        }
      };
    }

    render() {
      setTimeout(this.props.handleCollapse, 100);

      return React.createElement(FormTitle, {
        tag: 'h5',

        className: (this.props.i !== 0 ? Margins.marginTop20 + ' ' : '') + Margins.marginBottom8,

        onClick: () => {
          this.props.collapsed = !this.props.collapsed;
          this.props.handleCollapse();

          this.forceUpdate();
        },

        id: this.props.id
      },
        this.props.text,

        React.createElement(goosemod.webpackModules.findByDisplayName('DropdownArrow'), {
          className: [`gm-settings-header-collapser`, this.props.collapsed ? 'collapsed' : ''].join(' '),

          width: 22,
          height: 22
        })
      );
    }
  }
  };

  var header$1 = {
    __proto__: null,
    'default': header
  };

  var toggle = () => {
  const { React } = goosemod.webpackModules.common;

  const SwitchItem = goosemod.webpackModules.findByDisplayName('SwitchItem');

  const Markdown = goosemod.webpackModules.findByDisplayName('Markdown');

  const Tooltip = goosemod.webpackModules.findByDisplayName('Tooltip');
  const Science = goosemod.webpackModules.findByDisplayName('Science');
  const Alert = goosemod.webpackModules.findByDisplayName('InfoFilled');


  return class Toggle extends React.Component {
    constructor(props) {
      const originalHandler = props.onToggle;
      props.onChange = (e) => {
        this.props.value = e;
        this.forceUpdate();

        originalHandler(e);
      };
      
      if (props.experimental) {
        props.text = [
          React.createElement(Tooltip, {
            position: 'top',
            color: 'primary',

            text: 'Experimental',
          }, ({
            onMouseLeave,
            onMouseEnter
          }) =>
            React.createElement(Science, {
              width: 22,
              height: 22,

              className: 'gm-settings-label-icon',

              onMouseLeave,
              onMouseEnter
            })
          ),

          React.createElement('span', {
            className: 'gm-settings-label-text'
          }, props.text)
        ];

        props.subtext = `**Experimental:** ` + props.subtext;
      }

      if (props.debug) {
        props.text = [
          React.createElement(Tooltip, {
            position: 'top',
            color: 'primary',

            text: 'Debug',
          }, ({
            onMouseLeave,
            onMouseEnter
          }) =>
            React.createElement(Alert, {
              width: 22,
              height: 22,

              className: 'gm-settings-label-icon',

              onMouseLeave,
              onMouseEnter
            })
          ),

          React.createElement('span', {
            className: 'gm-settings-label-text'
          }, props.text)
        ];

        props.subtext = `**Debug:** ` + props.subtext;
      }

      super(props);
    }

    render() {
      return React.createElement(SwitchItem, {
        value: this.props.isToggled(),
        note: React.createElement(Markdown, {
          className: 'gm-settings-note-markdown'
        }, this.props.subtext || ''),

        disabled: this.props.disabled ? this.props.disabled() : false,

        onChange: this.props.onChange
      }, this.props.text);
    }
  }
  };

  var toggle$1 = {
    __proto__: null,
    'default': toggle
  };

  var text = () => {
  const Divider = _Divider();
  const { React } = goosemod.webpackModules.common;

  const FormItem = goosemod.webpackModules.findByDisplayName('FormItem');
  const FormText = goosemod.webpackModules.findByDisplayName('FormText');

  const Flex = goosemod.webpackModules.findByDisplayName('Flex');
  const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');

  const FormClasses = goosemod.webpackModules.findByProps('title', 'dividerDefault');
  const FormTextClasses = goosemod.webpackModules.findByProps('formText', 'placeholder');


  return class Text extends React.PureComponent {
    render() {
      return React.createElement(FormItem, {
          className: [Flex.Direction.VERTICAL, Flex.Justify.START, Flex.Align.STRETCH, Flex.Wrap.NO_WRAP, Margins.marginBottom20].join(' '),
        },

        React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between'
            }
          },

          React.createElement('div', {},
            React.createElement('div', {
                className: FormClasses.labelRow,
                style: {
                  marginBottom: '4px'
                }
              },

              React.createElement('label', {
                class: FormClasses.title
              }, this.props.text)
            ),

            React.createElement(FormText, {
              className: FormTextClasses.description
            }, this.props.subtext)
          )
        ),

        React.createElement(Divider)
      );
    }
  }
  };

  var text$1 = {
    __proto__: null,
    'default': text
  };

  var textAndButton = () => {
  const { React } = goosemod.webpackModules.common;

  const Divider = _Divider();

  const Button = goosemod.webpackModules.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');

  const Markdown = goosemod.webpackModules.findByDisplayName('Markdown');

  const FormItem = goosemod.webpackModules.findByDisplayName('FormItem');
  const FormText = goosemod.webpackModules.findByDisplayName('FormText');

  const Flex = goosemod.webpackModules.findByDisplayName('Flex');
  const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');

  const FormClasses = goosemod.webpackModules.findByProps('title', 'dividerDefault');
  const FormTextClasses = goosemod.webpackModules.findByProps('formText', 'placeholder');

  return class TextAndButton extends React.PureComponent {
    render() {
      return React.createElement(FormItem, {
          className: [Flex.Direction.VERTICAL, Flex.Justify.START, Flex.Align.STRETCH, Flex.Wrap.NO_WRAP, Margins.marginBottom20].join(' '),
        },

        React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between'
            }
          },

          React.createElement('div', {},
            React.createElement('div', {
                className: FormClasses.labelRow,
                style: {
                  marginBottom: '4px'
                }
              },

              React.createElement('label', {
                class: FormClasses.title
              }, this.props.text)
            ),

            React.createElement(FormText, {
              className: FormTextClasses.description
            },
              React.createElement(Markdown, {
                className: 'gm-settings-note-markdown'
              }, this.props.subtext || '')
            )
          ),

          React.createElement(Button, {
              color: this.props.danger ? Button.Colors.RED : Button.Colors.BRAND,
              disabled: this.props.disabled,

              onClick: () => this.props.onclick()
            },

            this.props.buttonText
          ),
        ),

        React.createElement(Divider)
      );
    }
  }
  };

  var textAndButton$1 = {
    __proto__: null,
    'default': textAndButton
  };

  var textAndColor = () => {
  const { React, constants: { DEFAULT_ROLE_COLOR, ROLE_COLORS } } = goosemod.webpackModules.common;

  const Divider = _Divider();
  const FormItem = goosemod.webpackModules.findByDisplayName('FormItem');
  const FormTitle = goosemod.webpackModules.findByDisplayName('FormTitle');

  const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');
  const TitleClasses = goosemod.webpackModules.findByProps('defaultMarginh5');

  const colorToHexString = (dColor) => {
    const r = ((dColor & 0xff0000) >>> 16).toString(16).padStart(2, '0');
    const g = ((dColor & 0xff00) >>> 8).toString(16).padStart(2, '0');
    const b = (dColor & 0xff).toString(16).padStart(2, '0');

    return '#' + r + g + b;
  };

  const hexStringToColor = (hex) => {
    if (!hex || hex.length !== 7) return undefined;

    return parseInt(hex.slice(1), 16);
  };

  return class TextAndColor extends React.PureComponent {
    constructor(props) {
      props.default = hexStringToColor((props.initialValue || (() => {}))()) || 0;
      props.value = props.default;

      super(props);
    }

    render() {
      const ColorPicker = goosemod.webpackModules.find((x) => x.default?.displayName === 'ColorPicker');

      return React.createElement(FormItem, {
          className: [Margins.marginBottom20].join(' '),
        },

        React.createElement(FormTitle, {
          tag: 'h5',
    
          className: (this.props.i !== 0 ? Margins.marginTop20 + ' ' : '') + TitleClasses.defaultMarginh5
        }, this.props.text),

        React.createElement(ColorPicker.default, {
          colors: ROLE_COLORS,
          defaultColor: this.props.default || DEFAULT_ROLE_COLOR,

          disabled: false,

          value: this.props.value,
          customColor: null,

          renderDefaultButton: (props) => React.createElement(ColorPicker.DefaultColorButton, props),

          renderCustomButton: (props) => React.createElement(ColorPicker.CustomColorButton, props),
          customPickerPosition: 'bottom',

          onChange: (x) => {
            this.props.value = x;

            this.forceUpdate();

            this.props.oninput(colorToHexString(x));
          }
        }),

        React.createElement(Divider)
      );
    }
  }
  };

  var textAndColor$1 = {
    __proto__: null,
    'default': textAndColor
  };

  var button = () => {
  const { React } = goosemod.webpackModules.common;

  goosemod.webpackModules.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');


  return class Button extends React.PureComponent {
    render() {
      return React.createElement(Button, {
        color: Button.Colors.BRAND,
        size: Button.Sizes.SMALL,

        disabled: this.props.disabled,

        onClick: () => this.props.onclick()
      },

      this.props.text
      );
    }
  }
  };

  var button$1 = {
    __proto__: null,
    'default': button
  };

  var search = () => {
  const { React } = goosemod.webpackModules.common;

  const SearchBar = goosemod.webpackModules.findByDisplayName('SearchBar');

  return class Search extends React.PureComponent {
    render() {
      if (!this.props.text) {
        this.props.text = '';
      }

      setTimeout(() => { this.props.onchange(this.props.text); }, 10);

      return React.createElement(SearchBar, {
        ...SearchBar.defaultProps,
        className: this.props.storeSpecific ? 'gm-store-search' : '',

        size: SearchBar.Sizes.MEDIUM,

        query: this.props.text,
        placeholder: this.props.placeholder || 'Search',

        onClear: () => {
          this.props.text = '';

          this.forceUpdate();

          // this.props.onchange(this.props.text);
        },

        onChange: (x) => {
          this.props.text = x;

          this.forceUpdate();

          // this.props.onchange(this.props.text);
        }
      })
    }
  }
  };

  var search$1 = {
    __proto__: null,
    'default': search
  };

  var dropdownIndividual = () => {
  const { React } = goosemod.webpackModules.common;

  const SelectTempWrapper = goosemod.webpackModules.findByDisplayName('SelectTempWrapper');

  const FormText = goosemod.webpackModules.findByDisplayName('FormText');

  const FormTextClasses = goosemod.webpackModules.findByProps('formText', 'placeholder');


  return class DropdownIndividual extends React.PureComponent {
    render() {
      if (typeof this.props.options === 'function') {
        this.props.options = this.props.options();
      }

      if (!this.props.value) {
        this.props.value = (this.props.selected || (() => {}))() || this.props.options[0];
      }

      setTimeout(() => { this.props.onchange(this.props.value); }, 10);

      return React.createElement('div', {
          className: 'gm-inline-dropdown'
        },

        React.createElement(FormText, {
          className: FormTextClasses.description
        }, this.props.label),
      
        React.createElement(SelectTempWrapper, {
          searchable: false,

          onChange: (x) => {
            this.props.value = x.value;

            this.forceUpdate();

            // this.props.onchange(this.props.value);
          },

          value: this.props.value,

          options: this.props.options.map((x) => ({ label: x, value: x}))
        })
    )
    }
  }
  };

  var dropdownIndividual$1 = {
    __proto__: null,
    'default': dropdownIndividual
  };

  var _StoreHeader = () => {
  const { React } = goosemod.webpackModules.common;

  const Text = goosemod.webpackModules.findByDisplayName('Text');

  const HeaderClasses = goosemod.webpackModules.findByProps('pageHeader');

  return class StoreHeader extends React.PureComponent {
    render() {
      return React.createElement('div', {
        className: [HeaderClasses.headerContainer, 'gm-store-header'].join(' ')
      }, React.createElement(Text, {
          color: Text.Colors.HEADER_PRIMARY,
          size: Text.Sizes.SIZE_20,

          className: HeaderClasses.pageHeader
        }, this.props.text)
      );
    }
  }
  };

  var storeHeader = {
    __proto__: null,
    'default': _StoreHeader
  };

  var storeCategory = () => {
  const { React } = goosemod.webpackModules.common;

  const StoreHeader = _StoreHeader();
  const Card = _Card();

  const ScrollerClasses = goosemod.webpackModules.findByProps('auto', 'scrollerBase');

  return class StoreCategory extends React.PureComponent {
    render() {
      if (!this.props.cards) {
        this.props.cards = goosemod.settings.items.find((x) => x[1] === this.props.itemName)[2].filter((x) => x.type === 'card').sort(this.props.sort).slice(0, 10).map((x) => React.createElement(Card, x));
      }

      return React.createElement('div', {
        className: 'gm-store-category'
      },
        React.createElement(StoreHeader, {
          text: this.props.text
        }),

        React.createElement('div', {
          className: ScrollerClasses.auto
        },
          ...this.props.cards
        ),
      );
    }
  }
  };

  var storeCategory$1 = {
    __proto__: null,
    'default': storeCategory
  };

  var custom = () => {
  const { React } = goosemod.webpackModules.common;

  return class Custom extends React.PureComponent {
    render() {
      return React.createElement('div', {
        ref: (ref) => {
          if (!ref) return;
          ref.appendChild(typeof this.props.element === 'function' ? this.props.element() : this.props.element);
        }
      });
    }
  }
  };

  var custom$1 = {
    __proto__: null,
    'default': custom
  };

  var textInput = () => {
  const { React } = goosemod.webpackModules.common;

  const Divider = _Divider;

  const FormItem = goosemod.webpackModules.findByDisplayName('FormItem');
  const FormText = goosemod.webpackModules.findByDisplayName('FormText');
  const TextInput = goosemod.webpackModules.findByDisplayName('TextInput');

  const Flex = goosemod.webpackModules.findByDisplayName('Flex');
  const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');
  const FormClasses = goosemod.webpackModules.findByProps('formText', 'description');


  return class TextInputGM extends React.PureComponent {
    render() {
      return React.createElement(FormItem, {
          title: this.props.text,
          className: [Flex.Direction.VERTICAL, Flex.Justify.START, Flex.Align.STRETCH, Flex.Wrap.NO_WRAP, Margins.marginBottom20].join(' ')
        },

        React.createElement(TextInput, {
          onChange: (x) => {
            this.props.oninput(x);
          },
          defaultValue: this.props.initialValue ? this.props.initialValue() : ''
        }),

        this.props.subtext && React.createElement(FormText, {
          className: [FormClasses.description, Margins.marginTop8].join(' ')
        }, this.props.subtext),

        React.createElement(Divider)
      );
    }
  }
  };

  var textInput$1 = {
    __proto__: null,
    'default': textInput
  };

  var subtext = () => {
  const { React } = goosemod.webpackModules.common;

  const FormText = goosemod.webpackModules.findByDisplayName('FormText');
  const Markdown = goosemod.webpackModules.findByDisplayName('Markdown');

  const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');

  return class Subtext extends React.PureComponent {
    render() {
      return React.createElement(FormText, {
        type: 'description',
        className: Margins.marginBottom20
      },
        React.createElement(Markdown, {
          className: 'gm-settings-note-markdown'
        }, this.props.text || '')
      );
    }
  }
  };

  var subtext$1 = {
    __proto__: null,
    'default': subtext
  };

}());//# sourceURL=GooseMod
