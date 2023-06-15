'use strict';
const {
	Sequelize,
	DataTypes,
	UniqueConstraintError,
} = require('sequelize');
const fs = require('node:fs');
const path = require('node:path');

class DatabaseHandler {
	constructor(DATABASE, PORT, USERNAME, PASSWORD, URI) {
		this.models = {};
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
			define: {},
		});
	}

	/**
	 * Allows the loading of necesary components for the database and later calls.
	 *
	 * @param callback callback function to run after asycnronus initiation.
	 */
	async init(callback) {
		await this.checkConnection();
		await this.loadModels();
		await this.destructiveSync();
		await callback.bind(this)();
	}

	/**
	 * Temporary logging function for errors
	 *
	 * @param err error to be logged
	 */
	errorLogger(err) {
		if (err instanceof Array) {
			err.forEach((err) => {
				this.errorLogger(err);
			});
			// ***This may come back to haunt me***
		} else if (err instanceof Error) {
			switch (typeof err) {
				case UniqueConstraintError:
					// eslint-disable-next-line no-case-declarations
					const error = err.errors[0];
					console.log(
						`${error.type} : ${error.value} ${error.message}`
					);
					break;
				default:
					console.log(`${err.name} : ${err.message}`);
					break;
			}
		}
	}
	/**
	 * Destroys database contents and syncs current models
	 */
	async destructiveSync() {
		await this.sequelize.sync({ force: true });
		await console.log('Destructive Sync');
	}
	/**
	 *
	 * @returns success 1, fail 0
	 */
	async checkConnection() {
		try {
			await this.sequelize.authenticate();
			console.log('Connection Secure.');
			return 1;
		} catch (error) {
			console.error('Unable to connect to the database:', error);
			return 0;
		}
	}
	/**
	 * displays table by name
	 * @param {string} name takes name of table
	 */
	async displayModel(name) {
		try {
			const model = await this.models[name].findAll();
			console.log(`${name}:`, JSON.stringify(model, null, 2));
		} catch (error) {
			console.log(`${name} does not exist`);
		}
	}
	/**
	 * Displays instance
	 * @param {any} instance
	 */
	async displayInstance(instance) {
		console.log(JSON.stringify(instance, null, 2));
	}
	/**
	 * Asyncrounously loads all models and relations from model folder.
	 */
	async loadModels() {
		const modelsPath = path.join(__dirname, 'models');
		const modelFiles = fs
			.readdirSync(modelsPath)
			.filter(
				(file) =>
					file.endsWith('.js') && !file.startsWith('relations')
			);

		console.log('loading models:');
		for (const file of modelFiles) {
			const filePath = path.join(modelsPath, file);
			const module = require(filePath);
			const model = module(this.sequelize, DataTypes);
			this.models[model.name] = model;
			console.log(`\t-${model.name}`);
		}

		const relationsFile = path.join(modelsPath, 'relations.js');
		if (fs.existsSync(relationsFile)) {
			const relations = require(relationsFile);
			relations(this.models);
			console.log('loaded relations');
		}
	}
	/**
	 * Add Instance to database table, either directly or as association.
	 *
	 * @param {any} source Table or Instance
	 * @param {object} obj instance data.
	 * @param {string} childType Name of child model to add.
	 * @param {object} args  external args
	 * @returns instance
	 */
	async createInstance(source, obj, childType, args) {
		return this.sequelize
			.transaction(async (t) => {
				t.afterCommit(() => console.log('done'));
				return source[
					`create${
						childType === undefined
							? ''
							: childType.charAt(0).toUpperCase() + childType.slice(1)
					}`
				](obj, args, { transaction: t });
			})
			.catch((err) => this.errorLogger(err));
	}
	/**
	 * Remove instances from table, either directly or as association.
	 * @param {Instance} source
	 * @returns Instance
	 */
	async destroyInstance(source) {
		return this.sequelize
			.transaction(async (t) => {
				t.afterCommit(() => console.log('done'));
				return source.destroy({ transaction: t });
			})
			.catch((err) => this.errorLogger(err));
	}
	/**
	 * Replaces the instance with the contents of objDetails
	 * @param {Instance} source
	 * @param {object} objDetails
	 * @returns Instance
	 */
	async modifyInstance(source, objDetails) {
		return this.sequelize
			.transaction(async (t) => {
				t.afterCommit(() => console.log('done'));
				source.update(objDetails);
				return source.save({ transaction: t });
			})
			.catch((err) => this.errorLogger(err));
	}
	/**
	 * Returns an instance based on object details
	 * @param {model} model
	 * @param {object} data
	 * @returns Instance
	 */
	async getInstance(model, data) {
		const instance = await model.findOne({ where: data });
		if (instance == null) {
			throw new Error('Instance does not exist');
		}
		return instance;
	}
	async getAssociations(source, targetModel) {
		console.log();
		const targetModelString = targetModel.name;
		if (targetModelString == source.constructor.name) {
			throw new Error(
				'target model cannot be the type of the instance'
			);
		}
		return await source[
			`get${
				targetModelString.charAt(0).toUpperCase() +
				targetModelString.slice(1)
			}s`
		]();
	}
	/**
	 * Validates that the model and instance are compatible with the database
	 * @param {Model} model
	 * @param {object} instance
	 */
	validateInstance(model, data) {
		const errors = [];
		if (data == undefined) {
			throw new Error('instance is empty or cannot be parsed');
		}
		for (const key in data) {
			if (!(key in model.getAttributes())) {
				errors.push(new Error(`key { ${key} } does not exist`));
			} else {
				const dbType =
					model.getAttributes()[key].type.constructor.name;
				const value = data[key];
				if (dbType == 'INTEGER' && isNaN(+value)) {
					errors.push(
						new Error(
							`value { ${value} } cannot be parsed to INTEGER`
						)
					);
				}
			}
		}
		if (errors.length > 0) {
			throw errors;
		}
		return data;
	}
	/**
	 *
	 * @param {String} model
	 */
	getModel(model) {
		if (!(model in this.models)) {
			throw new Error(`model { ${model} } does not exist`);
		}
		return this.models[model];
	}
}

module.exports = { DatabaseHandler };
