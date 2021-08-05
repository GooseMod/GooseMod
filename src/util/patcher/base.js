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

export const patch = (parent, functionName, handler, before = false) => {
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
        patch(parent, 'render', () => {}); // Noop patch in component render to force harden
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
const uninjectors = {};

export const inject = (_id, parent, functionName, handler, before = false) => {
  uninjectors[_id] = patch(parent, functionName, handler, before);
};

export const uninject = (_id) => {
  if (!uninjectors[_id]) return false;

  uninjectors[_id]();

  return true;
};