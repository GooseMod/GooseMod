import * as impl_localstorage from './impl/localStorage';
import * as impl_extension from './impl/extension';

// If extension version isn't defined, use localStorage
const impl = !window.gmExtension ? impl_localstorage : impl_extension;

if (impl.init) impl.init();

export default impl;