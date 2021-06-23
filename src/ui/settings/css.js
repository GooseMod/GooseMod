export default () => {
  const el = document.createElement('style');

  el.appendChild(document.createTextNode(`
#gm-settings-inject > div {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}

.gm-inline-dropdown {
  display: flex;
  align-items: center;

  gap: 8px;

  margin-left: 12px;
}

.gm-inline-dropdown > .select-2TCrqx {
  width: 120px;
}

.gm-store-search {
  flex-grow: 1;

  margin-right: 12px;
}

.gm-store-header {
  margin-bottom: 0;
}
`));

  document.body.appendChild(el);
}