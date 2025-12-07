const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let grid = [];

eachLine(filename, function(line) {
	grid.push(line.split('').map((x)=>x==='.'?0:x));
}).then(function(err) {
	for(let y=0;y<grid.length-1;y++) {
		for(let x=0;x<grid[y].length;x++) {
			switch(grid[y][x]) {
				case 0:
				case '^':
					break;
				case 'S':
					grid[y+1][x] = 1;
					break;
				default:
					if(grid[y+1][x]==='^') {
						grid[y+1][x-1] += grid[y][x];
						grid[y+1][x+1] += grid[y][x];
					} else {
						grid[y+1][x] += grid[y][x];
					}
					break;
			}
		}
	}
	answer = grid[grid.length-1].reduce((a,b)=>a+b);
  console.log(answer);
});
