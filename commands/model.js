const globals = require('../index.js');
module.exports = {
	'name': 'model',
	'manual': 'null',
	async execute(args) {
		const db = globals.databaseHandler;
		switch (args[0]) {
		case '-d':
		case '-display':
			await globals.databaseHandler.displayModel(args[1]);
			break;
		case '-att':
		case '-attributes':
			if (args[1] in db.models) {
				console.log(db.models[args[1]].uniqueKeys);
			} break;
		case '-add': {
			await addInstance(args, db);
		} break;
		case '-rm': {
			await removeInstance(args, db);
		} break;
		case '-mod':
		case '-modify': {
			await modifyInstance(args, db);
		} break;
		case '-check': {
			await checkInstance(args, db);
		} break;
		case '-association':
		case '-as': {
			await getAssociations(args, db);
		} break;
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
		let source = baseModel;
		if (args[3] == 'to') {
			const parentModel = db.getModel(args[4].toLowerCase());
			const parentData = db.validateInstance(parentModel, args[5]);
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
		const baseData = db.validateInstance(baseModel, args[2]);
		const source = await db.getInstance(baseModel, baseData);
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
async function getAssociations(args, db) {
	try {
		const baseModelString = args[1].toLowerCase();
		const baseModel = db.getModel(baseModelString);
		const baseData = db.validateInstance(baseModel, args[2]);
		const baseInstance = await db.getInstance(baseModel, baseData);
		const targetModelString = args[3].toLowerCase();
		const targetModel = db.getModel(targetModelString);
		const associations = await db.getAssociations(baseInstance, targetModel);
		associations.forEach((instance) => {
			console.log(instance.dataValues);
		});
	}
	catch (err) {
		db.errorLogger(err);
	}
}
async function checkInstance(args, db) {
	try {
		const baseModel = db.getModel(args[1].toLowerCase());
		const baseInstance = db.validateInstance(baseModel, args[2]);
		const source = await db.getInstance(baseModel, baseInstance);
		console.log(`Instance ${source != undefined ? 'exists' : 'does not exist'}`);
	}
	catch (err) {
		db.errorLogger(err);
	}
}