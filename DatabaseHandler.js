'use strict';
const { Sequelize, DataTypes } = require('sequelize');
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
			define: {
			},
		});
	}

	/**
     * Allows the loading of necesary components for the database for later calls.
     *
     * @param callback callback function to run after asycnronus initiation.
     */
	async init(callback) {
		await this.checkConnection();
		await this.loadModels();
		await this.destructiveSync();
		callback.bind(this)();
	}

	/**
     * Temporary logging function for errors
     *
     * @param err error to be logged
     */
	errorLogger(err) {
		if (err instanceof TypeError) {
			console.log(`${err.name} : ${err.lineNumber} ${err.message}`);
		}
		else {
			const error = err.errors[0];
			console.log(`Error: ${error.type} : ${error.value} ${error.message}`);
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
			console.log('Connection has been established successfully.');
			return 1;
		}
		catch (error) {
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
		}
		catch (error) {
			console.log(`${name} does not exist`);
		}
	}
	/**
     * Asyncrounously loads all models and relations from model folder.
     */
	async loadModels() {
		const modelsPath = path.join(__dirname, 'models');
		const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js')
            && !file.startsWith('relations'));

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
     * @param {Table} source (Table), (Model Instance).
     * @param {object} obj instance data.
     * @param {string} childType Name of child model to add.
     * @param {object} args  external args
     * @returns 0 if falied
     */
	async createInstance(source, obj, childType, args) {

		{return this.sequelize.transaction(async (t) => {
			return source[`create${childType === undefined
				? ''
				: childType.charAt(0).toUpperCase() + childType.toLowerCase().slice(1)}`](
				obj, args, { transaction: t });

		})
			.finally(
				() => console.log('done\n'),
				error => {

					this.errorLogger(error);
				},
			);}
	}
	/**
     * Remove instances from table, either directly or as association.
     * @param {Instance} parent
     * @param {object} where
     * @param {string} childType
     * @returns
     */
	async destroyInstance(parent, where, childType) {

		const state = await this.sequelize.transaction(async (t) => {

			if (where === undefined) { return parent.destroy({ transaction: t }); }
			const child = await parent[`get${childType}s`]({ where: where },
				{ transaction: t });
			if (child.length != 0) {
				return child[0].destroy({ transaction: t });
			}
			return 2;
		})
			.then(
				() => console.log('done\n'),
				error => { this.errorLogger(error); },
			);
		return state === 2 ? 2 : 1;

	}

	async getInstance(model, objDetails) {
		return model.findOne({ where : objDetails });
	}


}

module.exports = { DatabaseHandler };