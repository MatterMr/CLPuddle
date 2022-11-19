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
        '\\model -add user {discordId : MatterMr, osuId: 1234}',
        '\\model -add user {discordId : Shiggy, osuId: 2829032}',
		'\\model -check user {osssuId: 28290g33}',
		// '\\model -test',
		// '\\model -add user {discordId : MatterMr, osuId: 48848448}',
	]);
	readline.on('line', (input) => {
		ch.parseInput(input);
	});
});

exports.databaseHandler = databaseHandler;
