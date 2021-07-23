export const getReactInstance = (el) => el && el[Object.keys(el).find((x) =>
  x.startsWith('__reactInternalInstance') || // Old React
  x.startsWith('__reactFiber$') // New React (in Canary since ~22/07/21)
)];

// https://rauenzi.github.io/BDPluginLibrary/docs/modules_reacttools.js.html
export function getOwnerInstance(node, {include, exclude = ["Popout", "Tooltip", "Scroller", "BackgroundFlash"], filter = _ => _} = {}) {
  if (node === undefined) return undefined;
  
  const excluding = include === undefined;
  const nameFilter = excluding ? exclude : include;
  
  function getDisplayName(owner) {
    const type = owner.type;
    if (!type) return null;
    return type.displayName || type.name || null;
  }
  
  function classFilter(owner) {
    const name = getDisplayName(owner);
    return (name !== null && !!(nameFilter.includes(name) ^ excluding));
  }
  
  let curr = getReactInstance(node);
  
  for (curr = curr && curr.return; curr !== null; curr = curr.return) {
    if (curr === null) continue;
    
    const owner = curr.stateNode;  
    if (owner !== null && !(owner instanceof HTMLElement) && classFilter(curr) && filter(owner)) return owner;
  }
  
  return null;
}

export function findInReactTree(tree, searchFilter) {
  return findInTree(tree, searchFilter, {walkable: ["props", "children", "child", "sibling"]});
}

export function findInTree(tree, filter, {walkable = null, ignore = []} = {}) {
  if (!tree || typeof tree !== 'object') {
    return null;
  }

  if (typeof filter === 'string') {
    if (tree.hasOwnProperty(filter)) {
      return tree[filter];
    }

    return;
  } else if (filter(tree)) {
    return tree;
  }

  let returnValue = null;

  if (Array.isArray(tree)) {
    for (const value of tree) {
      returnValue = findInTree(value, filter, {
        walkable,
        ignore
      });

      if (returnValue) {
        return returnValue;
      }
    }
  } else {
    const walkables = !walkable ? Object.keys(tree) : walkable;

    for (const key of walkables) {
      if (!tree.hasOwnProperty(key) || ignore.includes(key)) {
        continue;
      }

      returnValue = findInTree(tree[key], filter, {
        walkable,
        ignore
      });

      if (returnValue) {
        return returnValue;
      }
    }
  }

  return returnValue;
}