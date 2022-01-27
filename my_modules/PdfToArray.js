import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

//create an array of each page text in the PDF
export const pdfToArray = async (url) => {
	let pdf = pdfjsLib.getDocument(url);
	// TODO: refactor this
	return pdf.promise.then(async (pdf) => {
		let maxPages = pdf._pdfInfo.numPages;
		let countPromises = []; // collecting all page promises
		for (let i = 1; i <= maxPages; i++) {
			let page = pdf.getPage(i);
			countPromises.push(
				page.then(async (page) => {
					// add page promise
					let textContent = page.getTextContent();
					return textContent.then((text) => {
						// return content promise
						return text.items
							.map(function (obj) {
								return obj.str;
							})
							.join(' '); // value page text
					});
				})
			);
		}
		// wait for all pages then join text
		const texts = await Promise.all(countPromises);
		for (let i = 0; i < texts.length; i++) {
			texts[i] = texts[i].replace(/\s+/g, ' ').trim();
		}
		// console.log(texts);
		return texts;
	});
};
