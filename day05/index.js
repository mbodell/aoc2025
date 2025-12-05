const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let ranges =[];
let type = 1;
let ing = [];

eachLine(filename, function(line) {
	if(type===1) {
		if(line.length===0) {
			type++;
		} else {
			ranges.push(line.split('-').map((x)=>parseInt(x)));
		}
	} else {
		ing.push(parseInt(line));
	}
}).then(function(err) {
	for(let i=0;i<ing.length;i++) {
		let fresh=0;
		for(let j=0;j<ranges.length;j++) {
			if(ing[i]>=ranges[j][0]&&ing[i]<=ranges[j][1]) {
				fresh++;
			}
		}
		if(fresh>0) {
			answer++;
		}
	}
  console.log(answer);
});
