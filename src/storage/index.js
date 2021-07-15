import * as impl_localstorage from './impl/localStorage';
import * as impl_extension from './impl/extension';

// If old extension / untethered localStorage will already be defined, so extension storage isn't in that old version
const impl = window.localStorage ? impl_localstorage : impl_extension;

if (impl.init) impl.init();

export default impl;