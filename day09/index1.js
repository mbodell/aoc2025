const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let corners = [];

function rectSize(a,b) {
	return (Math.abs(a[0]-b[0])+1)*(Math.abs(a[1]-b[1])+1);
}

function isValid(a,b) {
	let minY=(a[0]<b[0])?a[0]:b[0];
	let minX=(a[1]<b[1])?a[1]:b[1];
	let maxY=(a[0]>b[0])?a[0]:b[0];
	let maxX=(a[1]>b[1])?a[1]:b[1];
	let ret = true;
	let lastCorner=corners[corners.length-1];
	for(let i=0;i<corners.length&&ret;i++) {
		if(!((corners[i][0]===a[0]&&corners[i][1]===a[1])||(corners[i][0]===b[0]&&corners[i][1]===b[1])||(lastCorner[0]===a[0]&&lastCorner[1]===a[1])||(lastCorner[0]===b[0]&&lastCorner[1]===b[1]))) {
			if(corners[i][0]>minY&&corners[i][0]<maxY&&corners[i][1]>minX&&corners[i][1]<maxX) {
				ret = false;
			} else if(lastCorner[0]===corners[i][0]&&corners[i][0]>minY&&corners[i][0]<maxY&&((lastCorner[1]<=minX&&corners[i][1]>=maxX)||(lastCorner[1]>=maxX&&corners[i][1]<=minX))) {
				ret = false;
			} else if(lastCorner[1]===corners[i][1]&&corners[i][1]>minX&&corners[i][1]<maxX&&((lastCorner[0]<=minY&&corners[i][0]>=maxY)||(lastCorner[0]>=maxY&&corners[i][0]<=minY))) {
				ret = false;
			}
		}
		lastCorner=corners[i];
	}
	return ret;
}


eachLine(filename, function(line) {
	corners.push(line.split(",").map((x)=>parseInt(x)));
}).then(function(err) {
	for(let i=0;i<corners.length;i++) {
		for(let j=i+1;j<corners.length;j++) {
			let canSize = rectSize(corners[i],corners[j]);
			if(canSize > answer) {
				if(isValid(corners[i],corners[j])) {
					answer = canSize;
				}
			}
		}
	}
  console.log(answer);
});
