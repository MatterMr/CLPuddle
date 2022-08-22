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

	setCommands() {
		for (const file of this.commandFiles) {
			const filePath = path.join(this.commandsPath, file);
			const command = require(filePath);
			this.commands.set(command.name, command);
		}
	}

	async parseInput(input) {
		if (input[0] != '\\') return;
		const args = input.slice(1).trim().split(/\s+/);
		if (!this.commands.has(args[0])) return;
		return this.commands.get(args[0]).execute(args.slice(1), this)
			.catch((err) => console.log(err, '\n Command Failed : Reason UNKNOWN'));

	}

	async queueCommands(args) {
		for (const command of args) {
			console.log(command);
			await this.parseInput(command);
		}
	}
}

module.exports = { CommandHandler };