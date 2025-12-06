const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let numbers = [];
let syms = [];

eachLine(filename, function(line) {
	let nums = line.match(/\d+/g);
	if(nums) {
	  numbers.push(nums.map((x)=>parseInt(x)));
	} else {
		syms = line.split(/\s+/g);
	}
}).then(function(err) {
	for(let i=0;i<syms.length;i++) {
		let prob = 0;
		for(let j=0;j<numbers.length;j++) {
			switch(syms[i]) {
				case '*':
					if(j===0) { prob=1; }
					prob *= numbers[j][i];
					break;
        case '+':
					prob += numbers[j][i];
					break;
			}
		}
		answer += prob;
	}
  console.log(answer);
});
