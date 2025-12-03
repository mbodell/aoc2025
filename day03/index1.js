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
		let power = 0;
		let digits = 12;
		let idx = 0;
		for(let d=digits-1;d>=0;d--) {
			let nums = [...banks[i]];
			for(let j=0;j<d;j++) {
				nums.pop();
			}
			nums = nums.splice(idx);
			let m = nums.reduce((a,b)=>a>b?a:b);
			idx += nums.indexOf(m)+1;
			power = power*10+m;
		}
		answer += power;
	}
  console.log(answer);
});
