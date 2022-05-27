const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const timestamp = () =>
	new Date().toISOString().split('.')[0].replace('T', ' ');

const logEvents = async (message, fileName) => {
	const logItem = `${timestamp()}\t${uuid()}\t${message}`;
	try {
		if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
			await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
		}
		await fsPromises.appendFile(
			path.join(__dirname, '..', 'logs', fileName),
			logItem
		);
	} catch (error) {
		console.log(error);
	}
};

const logger = (req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	logEvents(`${req.headers.referer}\t${req.method}\t${req.url}`, 'reqLog.txt');
	next();
};

module.exports = logger;
