const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let ranges = [];

eachLine(filename, function(line) {
	ranges = line.split(',').map((x)=>x.split('-').map((y)=>parseInt(y)));
}).then(function(err) {
	for(let i=0;i<ranges.length;i++) {
		for(let id=ranges[i][0];id<=ranges[i][1];id++) {
			let idstr = id.toString();
			if(idstr.length%2===0 && idstr.substr(0,idstr.length/2) === idstr.substr(idstr.length/2)) {
				answer += id;
			}
		}
	}
  console.log(answer);
});
