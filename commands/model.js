const globals = require('../index.js');
module.exports = {
	'name': 'model',
	'manual': 'null',
	async execute(args) {
		const db = globals.databaseHandler;
		switch (args[0]) {
		case '-display':
			await globals.databaseHandler.displayModel(args[1]);
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
		case '-mod': {
			await modifyInstance(args, db);
		} break;
		case '-check': {
			await checkInstance(args, db);
		} break;
		case '-test':
			await testCode(db);
			break;
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
			await db.createInstance(sourceModel, args[2]);
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
		if (source === null) { throw new Error('Failed to retrive instance'); }
		await db.destroyInstance(source);
	}
	catch (err) {
		db.errorLogger(err);
	}
}

async function modifyInstance(args, db) {
	try {
		const sourceModelString = args[1].toLowerCase();
		if (!(sourceModelString in db.models)) { throw new Error('Source model does not exist'); }
		const model = db.models[sourceModelString];
		const source = await db.getInstance(model, stringToModel(args[2], model));
		if (source === null) { throw new Error('Failed to retrive instance'); }
		await db.modifyInstance(source, stringToModel(args[3], model));
	}
	catch (err) {
		db.errorLogger(err);
	}
}
async function checkInstance(args, db) {
	try {
		const sourceModelString = args[1].toLowerCase();
		if (!(sourceModelString in db.models)) { throw new Error('Source model does not exist'); }
		const model = db.models[sourceModelString];
		const source = await db.getInstance(model, args[2]);
		if (source === null) { throw new Error('Failed to retrive instance'); }
		console.log(`Instance Exists ${source != null}`);
	}
	catch (err) {
		db.errorLogger(err);
	}
}

async function testCode(db) {
	console.log('----Running Model Tests----');
	console.log('Creating Instances');
	const testUser = await db.createInstance(db.models['user'], { discordId: 'TestUser' });
	const testPool = await db.createInstance(testUser, { name: 'TestPool' }, 'pool');
	db.displayInstance(testUser);
	db.displayInstance(testPool);
	console.log('Modify Instances');
	await db.modifyInstance(testPool, { name: 'modifyedName' });
	await db.modifyInstance(testUser, { discordId: 'modifyedUserName', osuId: '10101010' });
	db.displayInstance(testUser);
	db.displayInstance(testPool);
	console.log('Destroy Instances');
	await db.destroyInstance(testUser);
	await db.destroyInstance(testPool);
	console.log('----End of Model Tests----');
}