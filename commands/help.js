module.exports = {
	'name': 'help',
	'manual': null,
	async execute(args, handler) {
		console.log('Try using \'\\man [COMMAND]\', to learn more about the commands.');
		let formatted_string = 'Commands:\n';
		for (const [key] of handler.commands) {
			formatted_string += (`\t${key}\n`);
		}
		console.log(formatted_string);
	},
};