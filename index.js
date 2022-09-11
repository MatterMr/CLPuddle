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
		// '\\model -att pool',
		'\\model -add user {MatterMr#2121, 30394303}',
		'\\model -add pool {testPool} to user {MatterMr#2121}',
		'\\model -add pool {testPool}',
		// '\\model -t',
		'\\model -d user',
		'\\model -d pool',
	]);
	readline.on('line', (input) => {
		ch.parseInput(input);
	});
});


exports.databaseHandler = databaseHandler;
