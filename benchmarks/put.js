const ethereumjs = require('merkle-patricia-tree');
const rainblock = require('@rainblock/merkle-patricia-tree');
const utils = require('./utils');
const wait = require('wait-for-stuff');

const warmUpRounds = 3;

const main = (blockNum) => {
	const batchOps = utils.readFixedFromDump(blockNum, -1);
	let latencyImprov = [0, 0];
  const startTime = process.hrtime();

  for (let rounds = 0; rounds < utils.maxRounds + warmUpRounds; rounds += 1) {
		rstate = new rainblock.MerklePatriciaTree();

		// Rainblock Benchmark
	  const startTimeRBC = process.hrtime();
		for (let i = 0; i < batchOps.length; i++) {
		 rstate.put(batchOps[i].key, batchOps[i].val);
		}
		const endTimeRBC = process.hrtime(startTimeRBC);

		const nodes = []
	  utils.countNodes(rstate.rootNode, nodes)
	  const nodesNumberRBC = nodes.length;
	  const totalTimeRBC = parseFloat(
        (endTimeRBC[0]*1000 + endTimeRBC[1]/1000000).toFixed(2), 10);
  
	  estate = new ethereumjs();

		// Ethereum Benchmark
	  const startTimeETH = process.hrtime();
	  for (let i = 0; i < batchOps.length; i++) {
	    let flag = false;
		  estate.put(batchOps[i].key, batchOps[i].val, () => {flag = true});
	    wait.for.predicate(() => flag);
    }
		const endTimeETH = process.hrtime(startTimeETH);

		const nodesNumberEth = estate.db.db.db._store.keys.length;
	  const totalTimeEth = parseFloat(
        (endTimeETH[0]*1000 + endTimeETH[1]/1000000).toFixed(2), 10);

    if (rounds >= warmUpRounds) {
	    latencyImprov[0] += totalTimeRBC;
      latencyImprov[1] += totalTimeEth;
    }
    console.log(totalTimeRBC, totalTimeEth);
  if (rstate.root.compare(estate.root) !== 0) {
    throw new Error("RootHash not maching");
  }
	}

  // Logging the performance
  const runTime = process.hrtime(startTime)[0];
  const rbcLat = parseFloat((latencyImprov[0]/utils.maxRounds).toFixed(2), 10);
  const ethLat = parseFloat((latencyImprov[1]/utils.maxRounds).toFixed(2), 10);
  const avgLatency = parseFloat((ethLat/rbcLat).toFixed(2), 10);

  const ops = batchOps.length;
  const rbcTps = parseFloat((ops/rbcLat).toFixed(2), 10);
  const ethTps = parseFloat((ops/ethLat).toFixed(2), 10);
  const avgThroughput = parseFloat((rbcTps/ethTps).toFixed(2), 10);

  console.log(blockNum, batchOps.length, runTime,
      avgLatency, rbcLat, ethLat,
      avgThroughput, rbcTps, ethTps);
};

console.log(
    "----Summary-------------",
    "----Latency---------------", 
    "----Throughput--------------------");

console.log(
    "Block",  "numKeys", "runTime(s)", 
    "ETH-RBC(x)", "RBC(ms)", "ETH(ms)", 
    "RBC-ETH(x)", "RBC(ops/ms)", "ETH(ops/ms)");

for (let blockNum = utils.startBlock; blockNum < utils.endBlock; blockNum += utils.interval) {
  if (!utils.skipBlocks.includes(blockNum)) {
    main (blockNum);
  }
}
