import fs from 'fs';

// create output folder and subfolders. return master folder
export const outputStructure = async (info) => {
	const outputDir = `./Output`;
	// create the output folder if it does not exist
	try {
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir);
		}
	} catch (err) {
		console.error(err);
	}
	// replace the / in the date for file naming
	let date = info.date.replace(/\//g, '-');
	// create a master folder in Output with a descriptive name
	const masterFolder = `${info.line}_${info.listLetter}_${date}`;
	try {
		if (!fs.existsSync(`./Output/${masterFolder}`)) {
			fs.mkdirSync(`./Output/${masterFolder}`);
		}
	} catch (err) {
		console.error(err);
	}
	return masterFolder;
};
