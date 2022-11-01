const globals = require('../index.js');
module.exports = {
	'name': 'ping',
	'synopsis': 'ping',
	'description': 'Displays the connection status',
	async execute() {
		globals.databaseHandler.checkConnection();
	},
};