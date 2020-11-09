const generateIdSegment = () => Math.random().toString(36).replace(/[^a-z0-9]+/g, ''); // Random 12 char string

const generateId = (segments = 3) => new Array(segments).fill(0).map(() => generateIdSegment()).join(''); // Chain random 12 char strings together X times

// Based on Powercord's Injector - <3
// https://github.com/powercord-org/powercord/blob/v2/src/fake_node_modules/powercord/injector/index.js

let injectionIndex = [];

export const inject = (injectionId, mod, funcName, patch, pre = false) => {
  if (!mod) {
    return console.error(`Tried to patch undefined (Injection ID "${injectionId}")`);
  }
  
  if (injectionIndex.find(i => i.id === injectionId)) {
    return console.error(`Injection ID "${injectionId}" is already used!`);
  }
  
  if (!mod.__goosemodInjectionId || !mod.__goosemodInjectionId[funcName]) { // First injection for the targetted function
    const id = generateId(); // Random ID to identify function
    
    mod.__goosemodInjectionId = Object.assign((mod.__goosemodInjectionId || {}), { [funcName]: id });
    
    mod[funcName] = (_oldMethod => function (...args) { // Override the function to do run injections pre and after
      const finalArgs = _runPreInjections(id, args, this);
      
      if (finalArgs !== false && Array.isArray(finalArgs)) {
        const returned = _oldMethod ? _oldMethod.call(this, ...finalArgs) : void 0;
        return _runInjections(id, finalArgs, returned, this);
      }
    })(mod[funcName]);
    
    injectionIndex[id] = [];
  }
  
  injectionIndex.push({ // Add injection to index to keep track
    module: mod.__goosemodInjectionId[funcName],
    id: injectionId,
    method: patch,
    pre
  });
};

export const uninject = (injectionId) => { // Remove injection from index (if there)
  injectionIndex = injectionIndex.filter(i => i.id !== injectionId);
};

export const isInjected = (injectionId) => injectionIndex.some(i => i.id === injectionId); // Check if the given id is in the index

const _runPreInjections = (modId, originArgs, _this) => { // Run pre injections (wrapper)
  const injections = injectionIndex.filter(i => i.module === modId && i.pre);
  
  if (injections.length === 0) {
    return originArgs;
  }
  
  return _runPreInjectionsRecursive(injections, originArgs, _this);
};

const _runPreInjectionsRecursive = (injections, originalArgs, _this) => { // Run pre injections (actual)
  const injection = injections.pop();
  
  let args = injection.method.call(_this, originalArgs);
  if (args === false) {
    return false;
  }

  if (!Array.isArray(args)) {
    console.error(`Pre-injection ${injection.id} returned something invalid. Injection will be ignored.`);

    args = originalArgs;
  }
  
  if (injections.length > 0) {
    return _runPreInjectionsRecursive(injections, args, _this);
  }
  
  return args;
};

const _runInjections = (modId, originArgs, originReturn, _this) => { // Run post injections
  let finalReturn = originReturn;
  
  const injections = injectionIndex.filter(i => i.module === modId && !i.pre);
  
  injections.forEach(i => {
    try {
      finalReturn = i.method.call(_this, originArgs, finalReturn);
    } catch (e) {
      console.error(`Failed to run injection "${i.id}"`, e);
    }
  });
  
  return finalReturn;
};