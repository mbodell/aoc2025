const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let machines = [];

function setLightN(l,n) {
	return l.substr(0,n)+(l[n]==='.'?'#':'.')+l.substr(n+1);
}

function joltMatch(a,b) {
	let ret = true;
	if(a.length===b.length) {
		for(let i=0;ret && i<a.length;i++) {
			if(a[i]!==b[i]) {
				ret = false;
			}
		}
	} else {
		ret = false;
	}
	//console.log(`Does ${a} match ${b}? ${ret}`);
	return ret;
}

function findMaxPush(li,bu,jo) {
	let ret = -1;
	for(let i=0;i<bu.length;i++) {
		let p = jo[bu[i]] - li[bu[i]];
		if(ret===-1 || p<ret) {
			ret = p;
		}
	}
	return ret;
}

function pushButNTimes(cur,but,n) {
	let ret = [];
	for(let i=0;i<cur.length;i++) {
		ret[i] = cur[i];
	}
	for(let i=0;i<but.length;i++) {
		ret[but[i]] += n;
	}
	return ret;
}
function joltEqual(c,j) {
	ret = true;
	if(c.length !== j.length) {
		ret = false;
	}
	for(let i=0;ret&&i<c.length;i++) {
		if(c[i]!==j[i]) {
			ret = false;
		}
	}
	return ret;
}

function solveMachine(cur,but,jolt,best) {
	if(joltEqual(cur,jolt)) {
		return 0;
	}
	if(but.length===0) {
		return -1;
	}
	let bestSolve = -1;
	let maxPush = findMaxPush(cur,but[0],jolt);
	if(best !== -1 && best < maxPush) {
		return -1;
	}
	let butTail = [];
	for(i=1;i<but.length;i++) {
		butTail.push(but[i]);
	}
	for(let push=maxPush;push>=0;push--) {
		let work = pushButNTimes(cur,but[0],push);
		let curBest = (bestSolve===-1)?-1:bestSolve-push;
		let nextBest = solveMachine(work,butTail,jolt,curBest);
		if(nextBest !== -1) {
			if(bestSolve === -1 || (nextBest + push)<bestSolve) {
				bestSolve = nextBest+push;
			}
		}
	}
	return bestSolve;
}

eachLine(filename, function(line) {
  let target = line.split("]")[0].split("[")[1];
	let buttons = line.split("]")[1].split(" {")[0].split(")").map((x)=>(x.substr(x.indexOf("(")+1).split(',').map((y)=>parseInt(y))));
	buttons.pop();
	buttons.sort((a,b)=>b.length-a.length);
	let joltage = line.split("{")[1].split("}")[0].split(",").map((x)=>parseInt(x));
	machines.push([target,buttons,joltage]);
}).then(function(err) {
	for(let i=0;i<machines.length;i++) {
		let minSol = -1;
		let lights = [];
		for(let j=0;j<machines[i][0].length;j++) {
			lights.push(0);
		}
		let solve = solveMachine(lights,machines[i][1],machines[i][2],-1);
		console.log(`solved machine ${i} with ${solve} button pushes`);
		answer += solve;
	}
  console.log(answer);
});
