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
    try {
        const baseModelString = args[1].toLowerCase();
        const baseModel = db.getModel(baseModelString);
        const baseInstance = db.validateInstance(baseModel, args[2]);
        var source = baseModel;
        if (args[3] == 'to') {
            const parentModel = db.getModel(args[4].toLowerCase());
            source = await db.getInstance(parentModel, args[5]);
        }
        await db.createInstance(source, baseInstance, (source != baseModel ? baseModelString : undefined));
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
        const baseModel = db.getModel(args[1].toLowerCase());
        const baseInstance = db.validateInstance(baseModel, args[2])
        const source = await db.getInstance(baseModel, baseInstance);
		console.log(`Instance ${source != undefined?'exists':'does not exist'}`);
	}
	catch (err) {
		db.errorLogger(err);
	}
}

async function testCode(db) {
    console.log('----Running Model Tests----');
	// console.log('Creating Instances');
	// const testUser = await db.createInstance(db.models['user'], { discordId: 'TestUser' });
	// const testPool = await db.createInstance(testUser, { name: 'TestPool' }, 'pool');
	// db.displayInstance(testUser);
	// db.displayInstance(testPool);
	// console.log('Modify Instances');
	// await db.modifyInstance(testPool, { name: 'modifyedName' });
	// await db.modifyInstance(testUser, { discordId: 'modifyedUserName', osuId: '10101010' });
	// db.displayInstance(testUser);
	// db.displayInstance(testPool);
	// console.log('Destroy Instances');
	// await db.destroyInstance(testUser);
	// await db.destroyInstance(testPool);
	console.log('----End of Model Tests----');
}