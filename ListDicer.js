import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
//
import { errorCheck } from './my_modules/ErrorCheck.js';
import { pdfToArray } from './my_modules/PdfToArray.js';
import { listProperties } from './my_modules/GetListProperties.js';
import { outputStructure } from './my_modules/GetOutputStructure.js';
import { getPageData } from './my_modules/GetPageData.js';

// traditional staple/paperclip structure (nonstapled legs get lumped together for paperclip)
const splitDocEach = async (data, input, path) => {
	// load the original document
	const original = await PDFDocument.load(fs.readFileSync(`./Input/${input}`));
	// make an output folder for bulk legs, and create/load the new doc
	const otherDoc = await PDFDocument.create();
	if (!fs.existsSync(`./Output/${path}/Other`)) {
		fs.mkdirSync(`./Output/${path}/Other`);
	}
	// store info about the most recent processed page
	let currentLeg = { leg: '', legDesc: '' };
	// iterate through the pages
	for (const x of data) {
		if (x.legDesc !== '') {
			// new folder
			// TODO: make this run once
			if (!fs.existsSync(`./Output/${path}/${x.legDesc}`)) {
				fs.mkdirSync(`./Output/${path}/${x.legDesc}`);
			}
			// new doc
			const doc = await PDFDocument.create();
			const [firstPage] = await doc.copyPages(original, [x.page - 1]);
			doc.addPage(firstPage);
			fs.writeFileSync(
				`./Output/${path}/${x.legDesc}/${x.priority}.pdf`,
				await doc.save()
			);
			[currentLeg.leg, currentLeg.legDesc] = [x.leg, x.legDesc];
			// console.log(currentLeg.leg, currentLeg.legDesc);
		} else if (currentLeg.leg === x.leg) {
			// push to current
			const doc = await PDFDocument.load(
				fs.readFileSync(
					`./Output/${path}/${currentLeg.legDesc}/${x.priority}.pdf`
				)
			);
			const [nextPage] = await doc.copyPages(original, [x.page - 1]);
			doc.addPage(nextPage);
			fs.writeFileSync(
				`./Output/${path}/${currentLeg.legDesc}/${x.priority}.pdf`,
				await doc.save()
			);
		} else {
			// push to other
			// if no other file exists, make one and add the page
			const [nextPage] = await otherDoc.copyPages(original, [x.page - 1]);
			otherDoc.addPage(nextPage);
		}
	}
	fs.writeFileSync(`./Output/${path}/Other/Other.pdf`, await otherDoc.save());
};

// traditional staple/paperclip structure (nonstapled legs get lumped together for paperclip)
const splitDocBulk = async (data, input, path) => {
	const original = await PDFDocument.load(fs.readFileSync(`./Input/${input}`));
	const newDoc = await PDFDocument.create();
	if (!fs.existsSync(`./Output/${path}/A`)) {
		fs.mkdirSync(`./Output/${path}/A`);
		fs.mkdirSync(`./Output/${path}/B`);
	}
	let currentLeg = { leg: '', legDesc: '' };
	const regexA =
		/COVER ASY|CNC CUT|SIDERAILS.*?:SAW|RL PNCH1|HOOK INST|STRIP CUTTER/;
	const regexB = /HDRFR|HDRRR|BOWFR|BOWFM|BOWRR|BOWRM/;
	for (const x of data) {
		let targetFolder = x.legDesc.match(regexA) ? 'A' : 'B';
		if (x.legDesc !== '') {
			const doc = await PDFDocument.create();
			const [firstPage] = await doc.copyPages(original, [x.page - 1]);
			doc.addPage(firstPage);
			fs.writeFileSync(
				`./Output/${path}/${targetFolder}/${x.legDesc}_${x.priority}.pdf`,
				await doc.save()
			);
			[currentLeg.leg, currentLeg.legDesc] = [x.leg, x.legDesc];
		} else if (currentLeg.leg === x.leg) {
			// push to current
			const doc = await PDFDocument.load(
				fs.readFileSync(
					`./Output/${path}/${targetFolder}/${x.legDesc}_${x.priority}.pdf`
				)
			);
			const [nextPage] = await doc.copyPages(original, [x.page - 1]);
			doc.addPage(nextPage);
			fs.writeFileSync(
				`./Output/${path}/${targetFolder}/${x.legDesc}_${x.priority}.pdf`,
				await doc.save()
			);
		} else {
			const [nextPage] = await otherDoc.copyPages(original, [x.page - 1]);
			newDoc.addPage(nextPage);
		}
	}
	fs.writeFileSync(`./Output/${path}/Other.pdf`, await otherDoc.save());
};

let listDicer = async () => {
	let inputPath = await errorCheck();
	let pageText = await pdfToArray(`./Input/${inputPath}`);
	let listInfo = await listProperties(pageText[0]);
	let listPath = await outputStructure(listInfo);
	let pageInfo = await getPageData(pageText, listInfo.line);
	let writeLegs = await splitDocEach(pageInfo, inputPath, listPath);
	// let writeLegs = await splitDocBulk(pageInfo, inputPath, listPath)
};

listDicer();
