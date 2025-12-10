const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;
let machines = [];

function setLightN(l,n) {
	return l.substr(0,n)+(l[n]==='.'?'#':'.')+l.substr(n+1);
}

eachLine(filename, function(line) {
  let target = line.split("]")[0].split("[")[1];
	let buttons = line.split("]")[1].split(" {")[0].split(")").map((x)=>(x.substr(x.indexOf("(")+1).split(',').map((y)=>parseInt(y))));
	buttons.pop();
	let joltage = line.split("{")[1].split("}")[0].split(",").map((x)=>parseInt(x));
	machines.push([target,buttons,joltage]);
}).then(function(err) {
	for(let i=0;i<machines.length;i++) {
		let lights = "";
		for(let j=0;j<machines[i][0].length;j++) {
			lights += ".";
		}
		let pushes = [];
		let push = 0;
		pushes[push] = [];
		pushes[push].push(lights);
		let valid = false;
		for(let p=0;!valid;p++) {
			let can ="";
			pushes[p+1] = [];
			for(let c=0;!valid&&c<pushes[p].length;c++) {
				can = pushes[p][c];
				if(can === machines[i][0]) {
					answer += p;
					valid = true;
					console.log(`Solved machine ${i} in ${p} pushes`);
				} else {
					for(let b=0;b<machines[i][1].length;b++) {
						let but = machines[i][1][b];
						let next = can;
						for(let bu=0;bu<but.length;bu++) {
							next = setLightN(next,but[bu]);
						}
						pushes[p+1].push(next);
					}
				}
			}
		}
	}
  console.log(answer);
});
