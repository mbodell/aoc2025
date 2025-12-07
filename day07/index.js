const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let grid = [];

eachLine(filename, function(line) {
	grid.push(line.split(''));
}).then(function(err) {
	for(let y=0;y<grid.length-1;y++) {
		for(let x=0;x<grid[y].length;x++) {
			switch(grid[y][x]) {
				case '.':
				case '^':
					break;
				case 'S':
					grid[y+1][x] = '|';
					break;
				case '|':
					if(grid[y+1][x]==='.') {
						grid[y+1][x] = '|';
					} else if(grid[y+1][x]==='^') {
						grid[y+1][x-1] = '|';
						grid[y+1][x+1] = '|';
					  answer++;
					}
					break;
			}
		}
	}
  console.log(answer);
});
