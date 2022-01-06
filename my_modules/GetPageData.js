// iterate through pages and collect data for each page
export const getPageData = async (list) => {
	let pageInfo = [];
	list.map((page, pageNumber) => {
		let data = {
			priority: '',
			leg: '',
			page: '',
			legDesc: '',
		};
		// get the leg
		const legRegex = /\d{7}\/?(-?\d?\d)/;
		const legMatch = page.match(legRegex);
		data.leg = legMatch[1];
		// get the priority number
		const priorityRegex = /(?:LP|HC|IM|TT|LT)\s[A-H]\s(\d\d)/;
		const priorityMatch = page.match(priorityRegex);
		data.priority = priorityMatch[1];
		// check for a leg descriptor
		const legTextRegex =
			/(COVER ASY)|(CNC) CUT|(SIDERAILS).*(?:SAW|RL PNCH1|HOOK INST)|(STRIP CUT)TER/; // (HDRFR)|(HDRRR)|(BOWFR)|(BOWFM)|(BOWRR)|(BOWRM)|(HDRSBOWS)
		let legTextMatch = page.match(legTextRegex);
		if (legTextMatch) {
			legTextMatch = legTextMatch.filter((x) => x !== undefined);
			// console.log(legTextMatch);
			data.legDesc = legTextMatch[1];
		}
		data.page = pageNumber + 1;
		pageInfo.push(data);
	});
	return pageInfo;
};
