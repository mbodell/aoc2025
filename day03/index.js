const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let banks = [];

eachLine(filename, function(line) {
	banks.push(line.split('').map((x)=>parseInt(x)));
}).then(function(err) {
	for(let i=0;i<banks.length;i++) {
		let sample = [...banks[i]];
		sample.pop();
		let m = sample.reduce((a,b)=>a>b?a:b);
		let n = [...banks[i]].splice(sample.indexOf(m)+1).reduce((a,b)=>a>b?a:b);
		answer += 10*m+n;
	}
  console.log(answer);
});
