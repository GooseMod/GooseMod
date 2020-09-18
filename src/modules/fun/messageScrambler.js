let version = '1.0.1';

let interval;

function scrambleMessages() {
	function getRandomInt(min, max) {
		minr = Math.ceil(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
		maxr = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
		return Math.floor(Math.random() * (maxr - minr) + minr);
	}

	const alphabet = "j☭∁₰☭∢⁌∄so⸎௹d𑱰⚝∞ç꘏⚼i⸙⦖☊⛠∜fjw꧁↾380၍r08d꫞o༼∆AU☬H៘◎◎U﷼#H☽RH⇘☭JKD༺FSNO(!#@(*$&☍DSA9⛠8|}⸙}F⚎F꫞ç☭L⚼߷J*♮⛧∜꧅!⁌&₷⸎꘏?SF>".split('');

	interval = setInterval(function () {
		let messages = document.getElementsByClassName("messageContent-2qWWxC");

		for (let message of messages) {
			message.textContent = [...message.textContent].map(() => alphabet[getRandomInt(0, alphabet.length)]).join('');
		}
	}, 500);
}

let obj = {
	// Activating module
	onImport: async function () {
		this.logger.debug('scrambleMessages', 'Starting Scrambler...');
		scrambleMessages();
	},

	// Removing function
	remove: async function () {
		clearInterval(interval);
	},
		
	// Random thing I don't rlly want
	logRegionColor: 'red',

	// Data
	name: 'Message Scrambler',
	description: 'Makes discord unusable by converting all messages into random text',

	author: 'Fjorge',

	version: version
};

obj