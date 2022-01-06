import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// check the environment for errors and return PDF file path
export const errorCheck = async () => {
	console.log(chalk.green('checking for errors'));
	let dirFiles;
	// check for an input folder
	try {
		dirFiles = fs.readdirSync('./Input');
	} catch {
		throw new Error(
			chalk.red(
				'Please make sure there is a folder named "Input" in your root directory'
			)
		);
	}
	// check for a single file in the input folder
	if (dirFiles.length != 1) {
		throw new Error(
			chalk.red(`Please make sure there is A SINGLE file in the input folder`)
		);
	}
	// check if the file is a PDF
	let filePath = dirFiles[0];
	if (path.extname(filePath) != '.pdf') {
		throw new Error(chalk.red('The file in the input folder must be a PDF'));
	}
	// check if the file has read/write permission
	try {
		fs.accessSync(`./Input/${filePath}`, fs.constants.R_OK | fs.constants.W_OK);
	} catch {
		throw new Error(chalk.red('PDF does not have read/write permission'));
	}
	return filePath;
};
