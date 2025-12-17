const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let machines = [];

let memo={};

let tooBig = 0;
let parityLights = [];

function preCalc(but,jolt) {
	memo={};
	tooBig = jolt.reduce((a,b)=>a+b)+1;
	let numLights = jolt.length;
	parityLights = [];
	for(let i=0;i<2**numLights;i++) {
		parityLights[i] = [];
	}
	for(let i=0;i<2**but.length;i++) {
		let toPush = i.toString(2);
		while(toPush.length<but.length) {
			toPush = "0" + toPush;
		}
		let lights = new Array(numLights).fill(0);
		let tp = toPush.split("").map((x)=>parseInt(x));
		let numTP = 0;
		for(let j=0;j<tp.length;j++) {
			if(tp[j]===1) {
				numTP++;
				for(let k=0;k<but[j].length;k++) {
					lights[but[j][k]]++;
				}
			}
		}
		let idx = parseInt(lights.map((x)=>(x%2).toString()).reduce((a,b)=>a+b),2);
		parityLights[idx].push([numTP,lights]);
	}
}
function solveMachine(but,jolt) {
	let joltHash = jolt.reduce((a,b)=>""+a+","+b);
	if(memo[joltHash]) {
		return memo[joltHash];
	}
	let min = jolt.reduce((a,b)=>(a<b)?a:b);
	let max = jolt.reduce((a,b)=>(a>b)?a:b);
	if(min<0) {
		memo[joltHash] = tooBig;
		return tooBig;
	}
	if(max===0) {
		memo[joltHash] = 0;
		return 0;
	}
	let parity = parseInt(jolt.map((x)=>(x%2).toString()).reduce((a,b)=>a+b),2);
	let ret = tooBig;
	for(let i=0;i<parityLights[parity].length;i++) {
		let can = parityLights[parity][i];
		let canJolt = [];
		for(let j=0;j<jolt.length;j++) {
			canJolt[j]=(jolt[j]-can[1][j])/2;
		}
		let canAns = can[0] + 2 * solveMachine(but,canJolt);
		if(canAns<ret) {
			ret = canAns;
		}
	}

	memo[joltHash] = ret;
	return ret;
}

eachLine(filename, function(line) {
  let target = line.split("]")[0].split("[")[1];
	let buttons = line.split("]")[1].split(" {")[0].split(")").map((x)=>(x.substr(x.indexOf("(")+1).split(',').map((y)=>parseInt(y))));
	buttons.pop();
	let joltage = line.split("{")[1].split("}")[0].split(",").map((x)=>parseInt(x));
	machines.push([target,buttons,joltage]);
}).then(function(err) {
	for(let i=0;i<machines.length;i++) {
		preCalc(machines[i][1],machines[i][2]);
		let solve = solveMachine(machines[i][1],machines[i][2]);
		console.log(`solved machine ${i} with ${solve} button pushes`);
		answer += solve;
	}
  console.log(answer);
});
