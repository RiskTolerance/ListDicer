// get basic info about the list
export const listProperties = async (page) => {
	let listInfo = {
		line: '',
		listLetter: '',
		date: '',
	};
	//get the line and the list letter
	let lineListRegex = /(LP|HC|IM|TT|LT)\s([A-H])\s(\d\d)/;
	let lineListMatch = page.match(lineListRegex);
	listInfo.line = lineListMatch[1];
	listInfo.listLetter = lineListMatch[2];
	//get the date
	let dateRegex = /(\d?\d\/\d?\d\/\d{4})/;
	let dateMatch = page.match(dateRegex);
	listInfo.date = dateMatch[1];
	// console.log(listInfo);
	return listInfo;
};
