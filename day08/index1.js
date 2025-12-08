const lineReader = require("line-reader");
const Promise = require('bluebird');

const eachLine = Promise.promisify(lineReader.eachLine);

let filename = process.argv.slice(2)[0] || 'input.txt';

let answer = 0;

let juncts = [];

let numCon = 1000;

function dist(a, b) {
	return (a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;
}

eachLine(filename, function(line) {
	juncts.push(line.split(',').map((x)=>parseInt(x)));
}).then(function(err) {
	//console.log(juncts);
	let adj = [];
	let d = [];
	for(let i=0;i<juncts.length;i++) {
		adj.push([]);
	}
	for(let i=0;i<juncts.length;i++) {
		for(let j=i+1;j<juncts.length;j++) {
			adj[i][j] = dist(juncts[i],juncts[j]);
			adj[j][i] = adj[i][j];
			d.push(adj[i][j]);
		}
	}
	let cir = new Array(juncts.length);
	cir.fill(-1);
	let numCir = 0;
	d.sort((a,b)=>a-b);
	for(let i=0;answer===0;i++) {
		let idMap = adj.map((x)=>x.filter((y)=>y===d[i])).map((z)=>z.length);
		let fCon = idMap.indexOf(1);
		let sCon = idMap.indexOf(1,fCon+1);
	//	console.log(`With a distance of ${d[i]} the ${i}th pair to connect is ${fCon} and ${sCon}`);
		if(cir[fCon]===-1&&cir[sCon]===-1) {
			cir[fCon] = numCir;
			cir[sCon] = numCir;
			numCir++;
		} else if(cir[fCon]===-1) {
			cir[fCon] = cir[sCon];
		} else if(cir[sCon]===-1) {
			cir[sCon] = cir[fCon];
		} else if(cir[fCon]!==cir[sCon]) {
			let cOld = (cir[fCon]<cir[sCon])?cir[fCon]:cir[sCon];
			let cNew = (cir[fCon]>cir[sCon])?cir[fCon]:cir[sCon];
			for(let j=0;j<cir.length;j++) {
				if(cir[j]===cNew) {
					cir[j]=cOld;
				}
			}
		}
		if(cir.filter((f)=>f===-1).length===0) {
			let se = new Set(cir);
			if(se.size===1) {
				console.log(`The last two items are ${fCon} and ${sCon}`);
				answer = juncts[fCon][0]*juncts[sCon][0];
			}
		}
	}
  console.log(answer);
});
