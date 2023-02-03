const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,
  balance,
} = require("@openzeppelin/test-helpers");

const { current } = require("@openzeppelin/test-helpers/src/balance");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { ethers } = require("hardhat");
const crypto = require("crypto");
const { expect } = require("chai");

describe("Testing free logic combination of boolean functions from multiple separate mission contracts", () => {
  let dquest;
  let m1, m2, m3;
  let accounts;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const M1 = await ethers.getContractFactory("Mission1");
    const M2 = await ethers.getContractFactory("Mission2");
    const M3 = await ethers.getContractFactory("Mission3");
    const Dquest = await ethers.getContractFactory("Dquest");


    m1 = await M1.deploy();
    m2 = await M2.deploy();
    m3 = await M3.deploy();
    dquest = await Dquest.deploy();

  });

  it("evaluate tree", async () => {

    // adding missions address to d.quest database
    await dquest.setMission(m1.address);
    await dquest.setMission(m2.address);
    await dquest.setMission(m3.address);

    /*
    for example a quest with formula: 
    (M1 AND M2) OR M3 will be represented by the following binary tree:
           OR(0)
          /  \
      AND(1)    M3(2)
      /  \
    M1(3)    M2(4)
    */


    // forming the tree
    await dquest.addNode(false, 0, 1, 1, 2); // index (0). Must be added firstly
    await dquest.addNode(false, 0, 0, 3, 4); // index (1). Must be added secondly
    await dquest.addNode(true, 2, 0, 0, 0); // index (2). Must be added thirdly
    await dquest.addNode(true, 1, 0, 0, 0); // index (3). Must be added at the fourth position
    await dquest.addNode(true, 0, 0, 0, 0); // index (4). Must be added at the fifth position

    let result = await dquest.questDone(accounts[0].address);
    // because mission1.finish() -> true; mission2.finish() -> false; mission3.finish() -> false
    // the entire tree will result in FALSE
    console.log(">>>result: ", result)

  });
});
