const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let floor = [];

eachLine(filename, function(line) {
	floor.push(line.split('').map((x)=>(x==='@')?1:0));
}).then(function(err) {
	let ne=[];
	for(let y=0;y<floor.length;y++) {
		ne.push([]);
		for(let x=0;x<floor[y].length;x++) {
			let n=0;
			if(y>0) {
				if(x>0) {
					n+=floor[y-1][x-1];
				}
				n+=floor[y-1][x];
				if(x+1<floor[y-1].length) {
					n+=floor[y-1][x+1];
				}
			}
			if(x>0) {
				n+=floor[y][x-1];
			}
			if(x+1<floor[y].length) {
				n+=floor[y][x+1];
			}
			if(y+1<floor.length) {
				if(x>0) {
					n+=floor[y+1][x-1];
				}
				n+=floor[y+1][x];
				if(x+1<floor[y+1].length) {
					n+=floor[y+1][x+1];
				}
			}
			ne[y][x]=n;
		}
	}
	let lastAns = -1;
	while(lastAns!==answer) {
		lastAns=answer;
		for(let y=0;y<floor.length;y++) {
			for(let x=0;x<floor[y].length;x++) {
				if(floor[y][x]===1&&ne[y][x]<4) {
					answer++;
					floor[y][x]=0;
					if(y>0) {
						if(x>0) {
							ne[y-1][x-1]-=1;
						}
						ne[y-1][x]-=1;
						if(x+1<floor[y-1].length) {
							ne[y-1][x+1]-=1;
						}
					}
					if(x>0) {
						ne[y][x-1]-=1;
					}
					if(x+1<floor[y].length) {
						ne[y][x+1]-=1;
					}
					if(y+1<floor.length) {
						if(x>0) {
							ne[y+1][x-1]-=1;
						}
						ne[y+1][x]-=1;
						if(x+1<floor[y+1].length) {
							ne[y+1][x+1]-=1;
						}
					}
				}
			}
		}
	}
  console.log(answer);
});
