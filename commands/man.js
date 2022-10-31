module.exports = {
	'name': 'man',
	'synopsis':'man [OPTION] [COMMAND_NAME]',
	'description': `
        Print manual for specifyed COMMAND or execute acording to OPTIONS.
        -l : List all available commands
        -s : Display only the synopsis of the command
        -d : Dsiplay only the description of the command`,
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
			const name = handler.commands.get(args[shift]).name;
			const synopsis = handler.commands.get(args[shift]).synopsis;
			const description = handler.commands.get(args[shift]).description;

			switch (args[0]) {
			case '-s':
				console.log(`SYNOPSIS\n\t${synopsis}`);
				break;
			case '-d':
				console.log(`DESCRIPTION\t${description}`);
				break;
			default:
				console.log(`NAME\n\t${name}\nSYNOPSIS\n\t${synopsis}\nDESCRIPTION${description}`);
				break;
			}
		}
	},
};