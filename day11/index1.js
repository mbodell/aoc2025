const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let cons = {};
let paths = [];
let numPath = 0;
let memo = {};

function solve(src,dest) {
	let hash = src+dest;
	if(memo[hash]) {
		return memo[hash];
	}
	if(src===dest) {
		memo[hash] = 1;
		return 1;
	}

	let ret = 0;
	let nexts = cons[src];
	for(let i=0;i<nexts.length;i++) {
		ret += solve(nexts[i],dest);
	}
	memo[hash] = ret;
	return ret;
}

eachLine(filename, function(line) {
	let parts = line.split(": ");
	let nexts = parts[1].split(" ");
	cons[parts[0]] = [];
	for(let i=0;i<nexts.length;i++) {
		cons[parts[0]].push(nexts[i]);
	}
}).then(function(err) {
	let numSvrDac = 0;
	let numSvrFft = 0;
	let numDacFft = 0;
	let numFftDac = 0;
	let numFftOut = 0;
	let numDacOut = 0;
	cons["out"] = [];
	memo = {};
	numSvrDac = solve('svr','dac');
	console.log(`numSvrDac = ${numSvrDac}`);
	memo = {};
	numSvrFft = solve('svr','fft');
	console.log(`numSvrFft = ${numSvrFft}`);
	memo = {};
	numDacFft = solve('dac','fft');
	console.log(`numDacFft = ${numDacFft}`);
	memo = {};
	numFftDac = solve('fft','dac');
	console.log(`numFftDac = ${numFftDac}`);
	memo = {};
	numFftOut = solve('fft','out');
	console.log(`numFftOut = ${numFftOut}`);
	memo = {};
	numDacOut = solve('dac','out');
	console.log(`numDacOut = ${numDacOut}`);
	let dacFirst = numSvrDac * numDacFft * numFftOut;
	let fftFirst = numSvrFft * numFftDac * numDacOut;
	console.log(`dacFirst = ${dacFirst} and fftFirst = ${fftFirst}`);
	answer = dacFirst + fftFirst;
  console.log(answer);
});
