'use strict';

const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});
const { CommandHandler } = require('./CommandHandler.js');
const { DatabaseHandler } = require('./DatabaseHandler');
const { DATABASE, PORT, USERNAME, PASSWORD } = require('./config.json');


const ch = new CommandHandler();
const databaseHandler = new DatabaseHandler(DATABASE, PORT, USERNAME, PASSWORD);

databaseHandler.init(() => {
	ch.queueCommands([
		// '\\man -s man',
		// '\\man -d man',
		// '\\man -o man',
		// '\\man -e man',
		// '\\man -s jddd',
		// '\\man -sss man',
		// '\\model -test',
	]);
	readline.on('line', (input) => {
		ch.parseInput(input);
	});
});

exports.databaseHandler = databaseHandler;
