const ethereumjs = require('merkle-patricia-tree');
const rainblock = require('@rainblock/merkle-patricia-tree');
const utils = require('./utils');
const wait = require('wait-for-stuff');

const main = (numKeys) => {

	let batchOps = utils.readFixedFromDump(3300000, numKeys);
console.log(batchOps.length);
  for (let i = 0; i < 13; i++) {

	  rstate = new rainblock.MerklePatriciaTree();
	  estate = new ethereumjs();

	  let startHeap = process.memoryUsage().heapUsed/(1024*1024);
	  let startTime = process.hrtime();

					let flag = true;
          for (let j = 0; j < batchOps.length; j++) {
					  rstate.put(batchOps[i].key, batchOps[i].val);
          }
					wait.for.predicate(() => flag);

					let endTime = process.hrtime(startTime);
					let endHeap = process.memoryUsage().heapUsed/(1024*1024);

					console.log('RBC, ', batchOps.length, ', ' +
							(endTime[0]*1000 + endTime[1]/1000000).toFixed(2) + ', ' +
							(endHeap - startHeap).toFixed(2))
						let totalTimeRBC = parseInt((endTime[0]*1000 + endTime[1]/1000000).toFixed(2), 10);
/*
					startHeap = process.memoryUsage().heapUsed/(1024*1024);
					startTime = process.hrtime();

					flag = false;
					estate.batch(batchOps, () => {flag = true});
					wait.for.predicate(() => flag);

					endTime = process.hrtime(startTime);
					endHeap = process.memoryUsage().heapUsed/(1024*1024);

					console.log('ETH, ', batchOps.length, ', ' +
							(endTime[0]*1000 + endTime[1]/1000000).toFixed(2) + ', ' +
							(endHeap - startHeap).toFixed(2))

						let totalTimeEth = parseInt((endTime[0]*1000 + endTime[1]/1000000).toFixed(2), 10);
					console.log('COMP Latency, ' + (totalTimeEth/totalTimeRBC).toFixed(2))
*/
  }
};

main (parseInt(process.argv[2], 10));
