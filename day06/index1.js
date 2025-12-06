const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let numbers = [];
let syms = [];
let n = [];

eachLine(filename, function(line) {
	let nums = line.match(/\d+/g);
	if(nums) {
	  numbers.push(nums.map((x)=>parseInt(x)));
    n.push(line.split(''));
	} else {
		syms = line.split(/\s+/g);
	}
}).then(function(err) {
	let probs=[];
	probs.push([]);
	for(let i=0;i<n[0].length;i++) {
		let nu="";
		for(let j=0;j<n.length;j++) {
			nu+=n[j][i];
		}
		let num=parseInt(nu);
		if(num) {
			probs[probs.length-1].push(num);
		} else {
			probs.push([]);
		}
	}
	for(let i=0;i<syms.length;i++) {
		switch(syms[i]) {
			case '*':
				answer += probs[i].reduce((a,b)=>a*b);
				break;
			case '+':
				answer += probs[i].reduce((a,b)=>a+b);
				break;
		}
	}
  console.log(answer);
});
