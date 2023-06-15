module.exports = {
	name: 'man',
	manual: null,
	async execute(args, handler) {
		const shift = args[1] == undefined ? 0 : 1;
		const command = handler.commands.get(args[shift]);
		if (command == undefined) {
			console.log('Command undefined');
			return;
		}
		const manual = command.manual;
		if (manual == null) {
			console.log('No manual exists');
			return;
		}

		if (!shift) {
			console.log(
				`#NAME\n\t${manual.name}\n` +
					`#SYNOPSIS\n${manual.synopsis}` +
					`#DESCRIPTION\n${manual.description}` +
					`#OPTIONS\n${manual.options}` +
					`#EXAMPLES\n${manual.examples}`
			);
		} else {
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
				default:
					console.log('Invalid Option');
			}
		}
	},
};
