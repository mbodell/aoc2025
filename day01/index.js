const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let instr = [];
let arrow = 50;

eachLine(filename, function(line) {
	let dir = line.match(/\w/g)[0];
	let dist = line.match(/\d+/g);
	instr.push([dir==='R'?1:-1,parseInt(dist)]);
}).then(function(err) {
	for(let i=0; i<instr.length; i++) {
		arrow += instr[i][0]*instr[i][1];
		arrow = arrow % 100;
		if(arrow === 0) {
			answer++;
		}
	}
  console.log(answer);
});
