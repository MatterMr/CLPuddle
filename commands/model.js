const globals = require('../index.js');
module.exports = {
	'name': 'model',
	'desc': 'model controller',
	'params': '',
	async execute(args) {

		switch (args[0]) {
		case '-d':
			await globals.databaseHandler.displayModel(args[1]);
			break;
		case '-t':
			await loadTemplateData()
				.catch(() => console.log(new Error('Data already exists and cannot be overwirtten')));
			break;
		default:
			console.log(globals.databaseHandler.models);
		}
	},
};

async function loadTemplateData() {
	const models = globals.databaseHandler.models;
	const User = models.get('users');
	const Pool = models.get('pools');
	await User.create({ discordId: 'MatterMr#2121' }, { include: Pool });
	await User.create({ discordId: 'tester#2121' }, { include: Pool });

	const user = await User.findOne({ where: { discordId: 'MatterMr#2121' } });
	await user.createPool({ name: 'testpool' });
}