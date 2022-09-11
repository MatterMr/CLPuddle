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
	const parentModelString = (args[3] == 'to') && args[4] !== undefined
		? args[4].toLowerCase()
		: undefined;
	const sourceModelString = args[1].toLowerCase();
	try {

		if (!(sourceModelString in db.models)) { throw new Error('Source model does not exist'); }
		if (parentModelString !== undefined && !(parentModelString in db.models)) { throw new Error('parent model does not exist'); }

		const sourceModel = db.models[sourceModelString];

		if (parentModelString === undefined) {
			await db.createInstance(sourceModel, stringToModel(args[2], sourceModel));
		}
		else {
			const parentModel = db.models[parentModelString];
			const source = await db.getInstance(parentModel, stringToModel(args[5], parentModel));
			if (source === null) { throw new Error('Failed to retrive parent instance'); }
			await db.createInstance(source, stringToModel(args[2], sourceModel), sourceModelString);
		}

	}
	catch (err) {
		db.errorLogger(err);
	}
}
async function removeInstance(args, db) {
	try {
		const sourceModelString = args[1].toLowerCase();
		if (!(sourceModelString in db.models)) { throw new Error('Source model does not exist'); }
		const model = db.models[sourceModelString];
		const source = await db.getInstance(model, stringToModel(args[2], model));
		if (source === null) { throw new Error('Failed to retrive parent instance'); }
		await db.destroyInstance(source);
	}
	catch (err) {
		db.errorLogger(err);
	}
}

async function loadTemplateData() {
	const db = globals.databaseHandler;
	const models = db.models;

	const user = await db.createInstance(models.user, { discordId: 'MatterMr#2121' });
	const tester = await db.createInstance(models.user, { discordId: 'tester#2121' });
	// console.log(Object.keys(user.uniqno));
	await db.createInstance(tester, { name: 'pooldd' }, 'posol');
	// await db.destroyInstance(db.getInstance(models.pool, { name : 'ddd' }));
	// await db.createInstance(tester, { name: 'pool 1' }, 'Pool');
	// await db.createInstance(user, { name: 'testpool' }, 'Pool');
}