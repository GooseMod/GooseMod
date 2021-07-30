export default async () => ({
  divider: (await import('./divider')).default(),
  header: (await import('./header')).default(),
  toggle: (await import('./toggle')).default(),
  text: (await import('./text')).default(),
  'text-and-button': (await import('./text-and-button')).default(),
  'text-and-color': (await import('./text-and-color')).default(),
  button: (await import('./button')).default(),
  search: (await import('./search')).default(),
  'dropdown-individual': (await import('./dropdown-individual')).default(),
  'store-header': (await import('./store-header')).default(),
  card: (await import('./card')).default(),
  'store-category': (await import('./store-category')).default(),
  custom: (await import('./custom')).default(),
  'text-input': (await import('./text-input')).default(),
  subtext: (await import('./subtext')).default()
});