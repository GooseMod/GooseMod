export const getReactInstance = (el) => el && el[Object.keys(el).find((x) => // Get React node from HTML element via internal key
  x.startsWith('__reactInternalInstance') || // Old React
  x.startsWith('__reactFiber$') // New React (in Canary since ~22/07/21)
)];

export const getNodeInternals = (node) => node &&
  node._reactInternalFiber || // Old React
  node._reactInternals; // New React (in Canary since ~22/07/21)

export const getOwnerInstance = (node) => { // Go through React node's parent until one is a React node (not null or HTML element)
  let inst = getReactInstance(node);

  while (inst.return) { // Whilst we can still go through parents
    inst = inst.return; // Go up to next parent

    if (inst.stateNode?._reactInternals) return inst.stateNode; // If React node, return
  }
};

export const findInTree = (parent, filter, opts) => { // Find in tree utility function - parameters supported like BD's + PC's APIs to maintain compatibility
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

export const findInReactTree = (node, filter) => findInTree(node, filter, { // Specialised findInTree for React nodes
  walkable: [ 'props', 'children', 'child', 'sibling' ]
});