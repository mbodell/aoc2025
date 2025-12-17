const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let cons = {};
let paths = [];
let numPath = 0;

eachLine(filename, function(line) {
	let parts = line.split(": ");
	let nexts = parts[1].split(" ");
	cons[parts[0]] = [];
	for(let i=0;i<nexts.length;i++) {
		cons[parts[0]].push(nexts[i]);
	}
}).then(function(err) {
	let v = {};
	v["you"] = 1;
	paths.push(['you',v]);
	while(paths.length>0) {
		let can = paths.shift();
		let nexts = cons[can[0]];
		for(let i=0;i<nexts.length;i++) {
			if(nexts[i]==="out") {
				numPath++;
			} else {
				if(can[1][nexts[i]]) {
					console.log(`looped,skipping`);
				} else {
					let visit = Object.assign({}, can[1]);
					visit[nexts[i]]=1;
					paths.push([nexts[i],visit]);
				}
			}
		}
	}
	answer = numPath;
  console.log(answer);
});
