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

async function addInstance(args, db) {
    try {
        const baseModelString = args[1].toLowerCase();
        const baseModel = db.getModel(baseModelString);
        const baseData = db.validateInstance(baseModel, args[2]);
        var source = baseModel;
        if (args[3] == 'to') {
            const parentModel = db.getModel(args[4].toLowerCase());
            const parentData = db.validateInstance(parentModel, args[5])
            const parentInstance = await db.getInstance(parentModel, parentData);
            source = parentInstance;
        }
        await db.createInstance(source, baseData, (source != baseModel ? baseModelString : undefined));
	}
	catch (err) {
		db.errorLogger(err);
	}
}
async function removeInstance(args, db) {
	try {
        const baseModelString = args[1].toLowerCase();
        const baseModel = db.getModel(baseModelString);
        const baseData = db.validateInstance(baseModel, args[2])
        const source = await db.getInstance(baseModel, baseData);
        console.log(source);
        await db.destroyInstance(source);
	}
	catch (err) {
		db.errorLogger(err);
	}
}

async function modifyInstance(args, db) {
	try {
        if (args[3] != 'to') { throw new Error('Incorrect syntax'); }
        const baseModelString = args[1].toLowerCase();
        const baseModel = db.getModel(baseModelString);
        const baseData = db.validateInstance(baseModel, args[2]);
        const replacementData = db.validateInstance(baseModel, args[4]);
        const baseInstance = await db.getInstance(baseModel, baseData);
        await db.modifyInstance(baseInstance, replacementData);
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