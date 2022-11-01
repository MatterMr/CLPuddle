module.exports = {
	'name': 'echo',
	'synopsis': 'echo [STRING]',
	'description': 'Repeats the STRING parameter',
	async execute(args) {
		console.log(args[0]);
	},
};