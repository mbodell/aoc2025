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
	let fin=[];
	while(ranges.length>0) {
		let uni=1;
		let test = ranges.pop();
		for(let i=0;i<ranges.length&&uni===1;i++) {
			if(test[0]<ranges[i][0]&&test[1]>=ranges[i][0]) {
				ranges[i][0]=test[0];
				ranges[i][1]=(test[1]>ranges[i][1]?test[1]:ranges[i][1]);
				uni=0;
			} else if(test[0]>=ranges[i][0]&&test[0]<=ranges[i][1]) {
				ranges[i][1]=(test[1]>ranges[i][1]?test[1]:ranges[i][1]);
				uni=0;
			}
		}
		if(uni===1) {
			fin.push(test);
		}
	}
	answer = fin.map((x)=>x[1]-x[0]+1).reduce((a,b)=>a+b);
  console.log(answer);
});
