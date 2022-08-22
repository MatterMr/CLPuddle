module.exports = {
	'name': 'echo',
	'desc': 'Repeats first parameter',
	'params': '(text)',
	async execute(args) {
		console.log(args[0]);
	},
};