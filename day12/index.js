const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let shapes = [];
let trees = [];
let shape = [];
let phase = 0;

eachLine(filename, function(line) {
	if(phase === 0) {
		let items = line.split(":");
		if(items[0].indexOf("x")!==-1) {
			phase = 1;
		} else {
			if(items[0].indexOf("#")!==-1) {
				shape.push(items[0]);
			} else if(items[0].length===0) {
				shapes.push(shape);
				shape = [];
			}
		}
	}
	if(phase === 1) {
		let items = line.split(": ");
		let dim = items[0].split("x").map((x)=>parseInt(x));
		let pres = items[1].split(" ").map((x)=>parseInt(x));
		trees.push([[dim[0],dim[1]],dim[0]*dim[1],pres]);
	}
}).then(function(err) {
	console.log(shapes);
	console.log(trees);
	let presArea = [];
	for(let i=0;i<shapes.length;i++) {
		presArea[i] = shapes[i].map((x)=>x.split('#').length-1).reduce((a,b)=>a+b);
	}
	console.log(presArea);
	for(let i=0;i<trees.length;i++) {
		if(trees[i][1]>=(trees[i][2].reduce((a,b)=>a+b)*9)) {
			console.log(`Tree ${i} trivially fits the presents`);
				answer++;
		} else {
			let minSize = 0;
			for(let j=0;j<trees[i][2].length;j++) {
				minSize += trees[i][2][j]*presArea[j];
			}
			if(minSize>trees[i][1]) {
				console.log(`Tree ${i} is obviously too small for the presents`);
			} else {
				console.log(`*** Need to do something smart`);
			}
		}
	}
  console.log(answer);
});
