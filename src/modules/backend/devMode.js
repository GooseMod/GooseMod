let version = '1.0.1';

function byProperties(props, filter = m => m) {
	return module => {
		const component = filter(module);
		if (!component) return false;
		return props.every(property => component[property] !== undefined);
	};
}

function newDev() {
	const filter = byProperties(["isDeveloper"]);
	const modules = webpackJsonp.push([[], {a: (m, e, t) => m.exports = t.c},[ ['a'] ]]);
	for (const index in modules) {
		const {exports} = modules[index];
		if (!exports) continue;
		if (exports.__esModule && exports.default && filter(exports.default))  {
			Object.defineProperty(exports.default, 'isDeveloper', { configurable: true, writable: true, value: 1 });
		}
	}
}

let obj = {
  onImport: async function() {
    this.logger.debug('devMode', 'Enabling Developer Mode');

    newDev();
	},
	
	remove: async function() {

	},

	logRegionColor: 'darkgreen',
	
	name: 'Dev Mode',
	description: 'Enables developer mode (experiments, etc.)',

	author: 'Ducko',

  version
};

obj