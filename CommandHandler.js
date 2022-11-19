'use strict';
const fs = require('node:fs');
const path = require('node:path');


class CommandHandler {
	constructor() {
		this.commandsPath = path.join(__dirname, 'commands');
		this.manualsPath = path.join(this.commandsPath, 'manuals');
		this.commandFiles = fs.readdirSync(this.commandsPath).filter(file => file.endsWith('.js'));
		this.manualFiles = fs.readdirSync(this.manualsPath).filter(file => file.endsWith('.json'));
		this.commands = new Map();
		this.setCommands();
	}
	/**
     * Loads all the commands from the commands directory
     */
	setCommands() {
		const manuals = this.loadManuals();
		for (const file of this.commandFiles) {
			const filePath = path.join(this.commandsPath, file);
			const command = require(filePath);
			command.manual = manuals.get(command.name);
			this.commands.set(command.name, command);
		}
	}
	/**
     * @returns Map of all command manuals
     */
	loadManuals() {
		const manuals = new Map();
		for (const file of this.manualFiles) {
			const filePath = path.join(this.manualsPath, file);
			const raw = fs.readFileSync(filePath);
			const manual = JSON.parse(raw);
			manuals.set(manual.name, this.formatManual(manual));
		}
		return manuals;
	}
	/**
     * Formats the manual from a parsed JSON, and fixes multiline issues with JSON conversions.
     * @param {Object} manual
     * @returns Object
     */
	formatManual(manual) {
		for (const key in manual) {
			if (Array.isArray(manual[key])) {
				let formatted = '';
				for (const line of manual[key]) {formatted += '\t' + line + '\n';}
				manual[key] = formatted;
			}
			else if (key != 'name') {manual[key] = '\t' + manual[key] + '\n';}
		}
		return manual;
	}

	/**
     * Manages the execution of commands based on string inputs, also converts strings formatted with brackets into objects
     * @param {String} input
     * @returns
     */
	async parseInput(input) {
		if (input[0] != '\\') return;
		input = input.slice(1);
		const args = this.objectFormater(input);
		if (!this.commands.has(args[0])) return;
		await this.commands.get(args[0]).execute(args.splice(1), this)
			.catch ((err) => console.log('Command Failed, Syntax Error\n', err));
	}
	/**
     *
     * @param {String} input
     * @param {} args
     * @returns formatter args
     */
	objectFormater(input) {
		const regex = new RegExp(/\s/);
		const parsable = input.split(regex);
		const args = [];
		let isObj = false;
		let objString = '';
		for (let s of parsable) {
			const wasObj = isObj;
			isObj = s[0] == '{' || s[s.length - 1] == '}' ? !isObj : isObj;
			s = s.replace(/[{}]/g, '');
			if (isObj || wasObj) {objString += s;}
			else {args.push(s);}
			if (wasObj != isObj && wasObj) {
				const obj = {};
				objString.split(',').forEach(function(property) {
					const tup = property.split(':');
					obj[tup[0]] = tup[1];
				});
				args.push(obj);
				objString = '';
			}
        }
		return args;
	}

	async queueCommands(args) {
		for (const command of args) {
			console.log(command);
			await this.parseInput(command);
		}
	}
}

module.exports = { CommandHandler };