const asyncChunks = require('async-chunks');
const ethereumjs = require('merkle-patricia-tree');
const ethUtil = require('ethereumjs-util');
const rainblock = require('@rainblock/merkle-patricia-tree');
const utils = require('./utils');
const wait = require('wait-for-stuff');

const batchOptions = [1, 10, 100, 1000]

const rmain = (state, batchOps, batchSize) => {
  for (let i = 0; i < batchOps.length; i += batchSize) {
    state.batch(batchOps.slice(i).slice(0, batchSize));
  }
};

const emain = (state, batchOps, batchSize) => {
  for (let i = 0; i < batchOps.length; i += batchSize) {
    let flag = false;
    state.batch(batchOps.slice(i).slice(0, batchSize), () => {flag = true});
    wait.for.predicate(() => flag);
  }
}

if (process.argv.length !== 3) {
  console.log("USAGE: node filename.js blockNum");
  process.exit(1);
}
const blockNum = parseInt(process.argv[2], 10);
const block = blockNum.toString();
const suite = utils.newBenchmark();
const batchOps = utils.readFixedFromDump(blockNum);
const rstate = new rainblock.MerklePatriciaTree();
const estate = new ethereumjs();
const size = ' ' + batchOps.length;

utils.addTest(suite, 'ETH ' + block + size,
  emain, null, estate, batchOps, batchOptions[3]);

for (let batchSize of batchOptions) {
  const batch = ' ' + batchSize.toString();

  utils.addTest(suite, 'RBC ' + block + batch + size,
    rmain, null, rstate, batchOps, batchSize);
}
suite.run();
