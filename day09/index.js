const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let corners = [];

function rectSize(a,b) {
	return (Math.abs(a[0]-b[0])+1)*(Math.abs(a[1]-b[1])+1);
}

eachLine(filename, function(line) {
	corners.push(line.split(",").map((x)=>parseInt(x)));
}).then(function(err) {
	for(let i=0;i<corners.length;i++) {
		for(let j=i+1;j<corners.length;j++) {
			let canSize = rectSize(corners[i],corners[j]);
			if(canSize > answer) {
				answer = canSize;
			}
		}
	}
  console.log(answer);
});
