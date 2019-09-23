const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('./tools/log.json');

	const rl = readline.createInterface({
	  input: fileStream,
	  crlfDelay: Infinity
	});
	for await (const line of rl) {
	  // Each line in input.txt will be successively available here as `line`.
	  console.log(`${line}`);
	  await sleep(100);
	}
}

processLineByLine();

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
