/* export { default as divider } from './divider';
export { default as header } from './header';
export { default as toggle } from './toggle'; */

export default async () => ({
  divider: require('./divider').default,
  header: require('./header').default,
  toggle: require('./toggle').default
});