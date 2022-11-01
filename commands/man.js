module.exports = {
	'name': 'man',
	'manual': null,
	async execute(args, handler) {
		const shift = args[1] == undefined ? 0 : 1;
		if (args[0] == '-l') {
			let formatted_string = 'Commands:\n';
			for (const [key] of handler.commands) {
				formatted_string += (`    ${key}\n`);
			}
			console.log(formatted_string);
		}
		if (handler.commands.has(args[shift])) {
			const manual = handler.commands.get(args[shift]).manual;
			if (manual == null) {
				console.log('No manual exists');
				return;
			}
			switch (args[0]) {
			case '-s':
			case '-synopsis':
				console.log(`#SYNOPSIS\n${manual.synopsis}`);
				break;
			case '-d':
			case '-description':
				console.log(`#DESCRIPTION\n${manual.description}`);
				break;
			case '-o':
			case '-options':
				console.log(`#OPTIONS\n${manual.options}`);
				break;
			case '-e':
			case '-examples':
				console.log(`#EXAMPLES\n${manual.examples}`);
				break;
			case '':
				console.log(
					`#NAME\n\t${manual.name}\n` +
                        `#SYNOPSIS\n${manual.synopsis}` +
                        `#DESCRIPTION\n${manual.description}` +
                        `#OPTIONS\n${manual.options}` +
                        `#EXAMPLES\n${manual.examples}`);
				break;
			default:
				console.log('Invalid Option');
			}
		}
		else {
			console.log('Invalid Command');
		}
	},
};