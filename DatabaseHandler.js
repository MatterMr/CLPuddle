'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('node:fs');
const path = require('node:path');

class DatabaseHandler {

	constructor(DATABASE, PORT, USERNAME, PASSWORD, URI) {
		this.models = new Map();
		this.sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
			host: URI == undefined ? 'localhost' : URI,
			dialect: 'postgres',
			port: PORT,
			pool: {
				max: 5,
				min: 0,
				idle: 10000,
			},
			logging: false,
			define: {
			},
		});
	}
	async init(callback) {
		await this.checkConnection();
		await this.loadModels();
		await this.destructiveSync();
		callback.bind(this)();
	}

	async destructiveSync() {
		await this.sequelize.sync({ force: true });
		await console.log('Destructive Sync');
	}

	async checkConnection() {
		try {
			await this.sequelize.authenticate();
			console.log('Connection has been established successfully.');
			return 1;
		}
		catch (error) {
			console.error('Unable to connect to the database:', error);
			return 0;
		}
	}

	async displayModel(name) {
		try {
			const model = await this.models.get(name).findAll();
			console.log(`${name}:`, JSON.stringify(model, null, 2));
		}
		catch (error) {
			console.log(`${name} does not exist`);
		}
	}

	async loadModels() {
		const modelsPath = path.join(__dirname, 'models');
		const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js')
            && !file.startsWith('relations'));

		console.log('loading models:');
		for (const file of modelFiles) {
			const filePath = path.join(modelsPath, file);
			const module = require(filePath);
			const model = module(this.sequelize, DataTypes);
			this.models.set(model.name, model);
			console.log(`\t-${model.name}`);
		}

		const relationsFile = path.join(modelsPath, 'relations.js');
		if (fs.existsSync(relationsFile)) {
			const relations = require(relationsFile);
			relations(this.models);
			console.log('loaded relations');
		}
	}
	async createInstance(source, obj, exargs, targetType) {
		try {
			return await this.sequelize.transaction(async (t) => {
				return source[`create${targetType === undefined ? '' : targetType}`](
					obj, exargs, { transaction: t });
			});
		}
		catch (err) {
			console.log(`ERROR: ${err.errors[0].type} : ${err.errors[0].value}
             ${err.errors[0].message}`);
		}
	}

}

module.exports = { DatabaseHandler };