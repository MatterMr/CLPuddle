module.exports = {
	'name': 'man',
	'desc': 'returns a manual',
	'params': '(commandname, -d?, -p?)',
	async execute(args, handler) {

		if (!handler.commands.has(args[0])) return;

		const description = handler.commands.get(args[0]).desc;
		const parameters = handler.commands.get(args[0]).params;

		if (args.includes('-d')) {
			console.log(`desc: ${description}`);
			return;
		}
		if (args.includes('-p')) {
			console.log(`params: ${parameters}`);
			return;
		}

		console.log(`description: ${description}\nparams: ${parameters}`);

	},
};