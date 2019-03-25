const asyncChunks = require('async-chunks');
const ethereumjs = require('merkle-patricia-tree');
const ethUtil = require('ethereumjs-util');
const rainblock = require('@rainblock/merkle-patricia-tree');
const utils = require('./utils');
const wait = require('wait-for-stuff');

const rmain = (state, batchOps) => {
  const init = (process.memoryUsage().heapUsed/(1024*1024)).toFixed(2);
  for (let i = 0; i < batchOps.length; i++) {
    state.put(batchOps[i].key, batchOps[i].val);
  }
  const final = (process.memoryUsage().heapUsed/(1024*1024)).toFixed(2);
  console.log("RBC - ", batchSize, ": ", final - init);
};

const emain = (state, batchOps) => {
  let flag = false;
  const init = (process.memoryUsage().heapUsed/(1024*1024)).toFixed(2);
  state.batch(batchOps, () => {flag = true});
  wait.for.predicate(() => flag);
  const final = (process.memoryUsage().heapUsed/(1024*1024)).toFixed(2);
  console.log("ETH - ", batchSize, ": ", final - init);
}

if (process.argv.length !== 3) {
  console.log("USAGE: node filename.js blockNum");
  process.exit(1);
}
const blockNum = parseInt(process.argv[2], 10);
const batchOps = utils.readFixedFromDump(blockNum);
const rstate = new rainblock.MerklePatriciaTree();
const estate = new ethereumjs();

rmain(rstate, batchOps);
emain(estate, batchOps);


