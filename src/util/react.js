export const getReactInstance = (el) => el && el[Object.keys(el).find((x) => // Get React node from HTML element via internal key
  x.startsWith('__reactInternalInstance') || // Old React
  x.startsWith('__reactFiber$') // New React (in Canary since ~22/07/21)
)];

export const getOwnerInstance = (node) => { // Go through React node's parent until one is a React node (not null or HTML element)
  let inst = getReactInstance(node);

  while (inst.return) {
    inst = inst.return;

    if (inst.stateNode?._reactInternals) return inst.stateNode;
  }

  return null;
};

export const findInTree = (parent, filter, opts) => { // Find in tree utility function - parameters supported like BD's + PC's APIs to maintain compatibility
  const { walkable = null, ignore = [] } = opts;

  if (!parent || typeof parent !== 'object') {
    return null;
  }

  if (typeof filter === 'string') {
    if (parent.hasOwnProperty(filter)) return tree[filter];
    return null;
  }
  
  if (filter(parent)) return parent;

  if (Array.isArray(parent)) {
    return parent.find((x) => findInTree(x, filter, opts));
  }

  return (walkable || Object.keys(parent)).find((x) => !ignore.includes(x) && findInTree(parent[x], filter, opts));
};

export const findInReactTree = (node, filter) => findInTree(node, filter, { // Specialised findInTree for React nodes
  walkable: [ 'props', 'children', 'child', 'sibling' ]
});