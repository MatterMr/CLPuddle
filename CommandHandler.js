'use strict';
const fs = require('node:fs');
const path = require('node:path');


class CommandHandler {
	constructor() {
		this.commandsPath = path.join(__dirname, 'commands');
		this.commandFiles = fs.readdirSync(this.commandsPath).filter(file => file.endsWith('.js'));
		this.commands = new Map();
		this.setCommands();
	}
	/**
     * Loads all the commands from the commands directory
     */
	setCommands() {
		for (const file of this.commandFiles) {
			const filePath = path.join(this.commandsPath, file);
			const command = require(filePath);
			this.commands.set(command.name, command);
		}
	}
	/**
     * Manages the execution of commands based on string inputs, also converts strings formatted with brackets into objects
     * @param {String} input
     * @returns
     */
	async parseInput(input) {
		if (input[0] != '\\') return;
		const args = this.objectFormater(input, input.slice(1).trim().split(/\s+/));
		if (!this.commands.has(args[0])) return;
		// console.log(args);
		this.commands.get(args[0]).execute(args.slice(1), this)
			.catch ((err) => console.log('Command Failed, Syntax Error\n', err));
	}
	/**
     *
     * @param {String} input
     * @param {} args
     * @returns
     */
	objectFormater(input, args) {
		const regex = new RegExp(/[{}]+/);
		if (regex.test(input)) {
			const parsable = input.split(regex);
			const objs = [];
			let l = 0;
			for (let i = 1; i < parsable.length; i += 2) {
				objs.push(parsable[i].split(', '));
			}
			for (let i = 1; i < args.length; i++) {
				if (args[i][0] == '{') {
					args[i] = objs[l];
					args.splice(i + 1, objs[l].length - 1);
					l++;
				}
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