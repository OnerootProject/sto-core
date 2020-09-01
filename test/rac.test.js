const RAC = artifacts.require('./RAC.sol')
const Utils = require("./common/utils");
const Web3 = require("web3");
const Web3Utils = require('../utils/Web3Utils');
const Log = require('../utils/LogConsole');
var { catchRevert } = require("./common/exceptions");
const BigNumber = require("bignumber.js");
const roles = require('../doc/public/vendors/oneroot/js/role');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Hardcoded development port

contract("RAC", accounts => {
    // temporary Variable declaration
    let tx;
    let res;

    // Accounts Variable declaration
    let owner;


    // Contract Instance Declaration
    let iRAC;

    before(async () => {
        // Accounts setup
        owner = accounts[0];

        iRAC = await RAC.new({ from: owner });
        assert.ok(iRAC);

    });

    describe("test rac", async () => {

        it("add role", async () => {
            tx = await iRAC.addRole(owner, 'createST', {from: owner});
            // console.debug('tx:', tx);
            Log.debug('tx logs args:', tx.logs[0].args);
            assert.equal(tx.receipt.status, 1, "Failed to addRole");

        });

        it("check role", async () => {
            tx = await iRAC.checkRole(owner, 'createST');
            console.debug('tx:', tx);
            assert.equal(tx, true, "Failed to check");

        });

        it("batch add roles", async () => {
            // console.log(owner, roles.roles);
            tx = await iRAC.batchAddRole(owner, roles.RAC_ROLES, {from: owner});
            console.debug('tx:', tx);
            Log.debug('tx logs args:', tx.logs[0].args);
            assert.equal(tx.receipt.status, 1, "Failed to batchAddRole");

        });

        it("batch remove roles", async () => {
            // console.log(owner, roles.roles);
            tx = await iRAC.batchRemoveRole(owner, ['createST','createSTO'], {from: owner});
            console.debug('tx:', tx);
            Log.debug('tx logs args:', tx.logs[0].args);
            assert.equal(tx.receipt.status, 1, "Failed to batchRemoveRole");

        });

        it("check role", async () => {
            tx = await iRAC.checkRole(owner, 'createST');
            console.debug('tx:', tx);
            assert.equal(tx, false, "Failed to check");

        });

    });

});
