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
			await loadTemplateData();
			break;
		default:
			console.log(globals.databaseHandler.models);
		}
	},
};

async function loadTemplateData() {
	const db = globals.databaseHandler;
	const models = db.models;
	const User = models.get('users');
	const Pool = models.get('pools');
	const user = await db.createInstance(User, { discordId: 'MatterMr#2121' });
	const tester = await User.create({ discordId: 'tester#2121' }, { include: Pool });

	await db.createInstance(tester, { name: 'pool' }, undefined, 'Pool');
	console.log(await db.createInstance(tester, { name: 'pool' }, undefined, 'Pool'));
	await db.createInstance(user, { name: 'testpool' }, undefined, 'Pool');

	console.log(await db.destroyInstance(tester, { name: 'pool' }, 'Poosl'));

	// const pool = await Pool.findOne({ where : { name : 'pool' } });
	// console.log(child instanceof Pool);
	// console.log(pool instanceof Pool);
}