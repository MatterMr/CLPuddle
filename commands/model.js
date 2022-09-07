const globals = require('../index.js');
module.exports = {
	'name': 'model',
	'desc': 'model controller',
	'params': '',
	async execute(args) {
		const db = globals.databaseHandler;
		switch (args[0]) {
		case '-d':
			await globals.databaseHandler.displayModel(args[1]);
			break;
		case '-t':
			await loadTemplateData();
			break;
		case '-att':
			if (args[1] in db.models) {
				console.log(db.models[args[1]].uniqueKeys);
			}
			break;
		case '-add': {
			await addInstance(args, db);
		} break;
		case '-rm': {
			await removeInstance(args, db);
		} break;
		default:
			console.log(globals.databaseHandler.models);
		}
	},
};
function stringToModel(arr, model) {
	const obj = {};
	let index = 0;
	for (const key in model.uniqueKeys) {
		obj[model.uniqueKeys[key].column] = arr[index];
		index++;
		if (index > arr.length - 1) {break;}
	}
	return obj;
}

async function addInstance(args, db) {
	const model = db.models[args[1]];
	if (args[3] == 'to') {
		const parentModel = db.models[args[4]];
		const source = await db.getInstance(parentModel, stringToModel(args[5], parentModel));
		await db.createInstance(source, stringToModel(args[2], model), model.name);
	}
	else {
		await db.createInstance(model, stringToModel(args[2], model));
	}
}
async function removeInstance(args, db) {
	const model = db.models[args[1]];
	const source = await db.getInstance(model, stringToModel(args[2], model));
	await db.destroyInstance(source);
}

async function loadTemplateData() {
	const db = globals.databaseHandler;
	const models = db.models;

	// const user = await db.createInstance(models.user, { discordId: 'MatterMr#2121' });
	const tester = await db.createInstance(models.user, { discordId: 'tester#2121' });
	// console.log(Object.keys(user.uniqno));
	await db.createInstance(tester, { name: 'pool' }, 'pools');
	// await db.createInstance(tester, { name: 'pool 1' }, 'Pool');
	// await db.createInstance(user, { name: 'testpool' }, 'Pool');
}