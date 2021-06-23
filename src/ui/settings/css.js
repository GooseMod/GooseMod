export default () => {
  const el = document.createElement('style');

  el.appendChild(document.createTextNode(`
.gm-inline-dropdown {
  display: inline-flex;
  align-items: center;

  gap: 8px;

  margin-left: 12px;
}

.gm-inline-dropdown > .select-2TCrqx {
  width: 120px;
}

.gm-store-search {
  flex-grow: 1;
  display: inline-flex;

  margin-right: 12px;
}
`));

  document.body.appendChild(el);
}