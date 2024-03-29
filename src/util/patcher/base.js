import _GMErrorBoundary from "./GMErrorBoundary";
let GMErrorBoundary;

const generateIdSegment = () => Math.random().toString(16).substring(2); // Random 13 char hex string

export const generateId = (segments = 3) => new Array(segments).fill(0).map(() => generateIdSegment()).join(''); // Chain random ID segments

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

      if (Array.isArray(toSetNewArgs)) newArgs = toSetNewArgs;
    } catch (e) {
      console.error(`Before patch (${id} - ${functionName}) failed, skipping`, e);
    }
  }

  return newArgs;
};

const insteadPatches = (context, newArgs, originalFunc, id, functionName, keyName) => {
  const patches = modIndex[id][keyName].instead;
  if (patches.length === 0) return originalFunc.apply(context, newArgs);

  let newReturnValue = undefined;

  for (const patch of patches) {
    try {
      let toSetReturnValue = patch.call(context, newArgs, originalFunc.bind(context));

      if (toSetReturnValue !== undefined) newReturnValue = toSetReturnValue;
    } catch (e) {
      console.error(`Instead patch (${id} - ${functionName}) failed, skipping`, e);
    }
  }
  
  return newReturnValue;
};

const afterPatches = (context, newArgs, returnValue, id, functionName, keyName) => {
  const patches = modIndex[id][keyName].after;
  
  let newReturnValue = returnValue;

  for (const patch of patches) {
    try {
      let toSetReturnValue = patch.call(context, newArgs, newReturnValue);

      if (toSetReturnValue !== undefined) newReturnValue = toSetReturnValue;
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
    const returnValue = insteadPatches(this, args, originalFunction, id, functionName, keyName);

    toReturn = afterPatches(this, newArgs, returnValue, id, functionName, keyName);
  }

  if (modIndex[id][keyName].harden) {
    if (!GMErrorBoundary) GMErrorBoundary = _GMErrorBoundary();
    const { React } = goosemod.webpackModules.common;

    return React.createElement(GMErrorBoundary, {}, toReturn);
  }

  return toReturn;
});

export const patch = (parent, functionName, handler, before = false, instead = false) => {
  if (typeof parent[functionName] !== 'function') {
    goosemod.logger.debug('patcher', 'Failed to patch as key isn\'t func', parent, functionName);
    return () => {}; // Stub func to not break
  }

  if (!parent._goosemodPatcherId) {
    const id = generateId();

    parent._goosemodPatcherId = id;

    modIndex[id] = {};
  }

  const id = parent._goosemodPatcherId;
  const keyName = `gm-${functionName}`;

  if (!modIndex[id][keyName]) {
    const original = parent[functionName];

    parent[functionName] = Object.assign(generateNewFunction(original, id, functionName, keyName), original);

    parent[functionName].toString = () => original.toString(); // You cannot just set directly a.toString = b.toString like we used to because strange internal JS prototype things, so make a new function just to run original function

    let toHarden = false;
    if (isReactComponent(original)) toHarden = true;
    if (parent.render) {
      if (functionName !== 'render') {
        patch(parent, 'render', () => {}); // Noop patch in component render to force harden
      } else {
        toHarden = true;
      }
    }

    if (original.displayName?.endsWith('Item')) toHarden = false;

    modIndex[id][keyName] = {
      before: [],
      after: [],
      instead: [],

      harden: toHarden,
      original
    };
  }

  const patchType = instead ? 'instead' : (before ? 'before' : 'after');
  const newLength = modIndex[id][keyName][patchType].push(handler);

  return () => { // Unpatch function
    modIndex[id][keyName][patchType].splice(newLength - 1, 1);

    // If no patches, revert back to original
    const noPatches = ['before', 'after', 'instead'].every(x => modIndex[id][keyName][x].length === 0);
    if (noPatches) {
      parent[functionName] = modIndex[id][keyName].original;

      delete parent._goosemodPatcherId;
      // delete modIndex[id];
    }
  };
};

// DEPRECATED: Compatibility functions for modules from older (<5.8.0) GooseMod versions
const uninjectors = {};

export const inject = (_id, parent, functionName, handler, before = false) => {
  uninjectors[_id] = patch(parent, functionName, handler, before);
};

export const uninject = (_id) => {
  if (!uninjectors[_id]) return false;

  uninjectors[_id]();

  return true;
};