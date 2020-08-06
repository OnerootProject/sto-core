const DeployContract = require("./common/deployContract");
const SecurityToken = artifacts.require('./SecurityToken.sol')
const DefaultSTO = artifacts.require('./stos/DefaultSTO.sol')
const RAC = artifacts.require('./RAC.sol')
const Utils = require("./common/utils");
const Web3 = require("web3");
const Web3Utils = require('../utils/Web3Utils');
const Log = require('../utils/LogConsole');
var { catchRevert } = require("./common/exceptions");
const BigNumber = require("bignumber.js");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Hardcoded development port

contract("SecurityToken", accounts => {
    // temporary Variable declaration
    let tx;
    let res;

    // Accounts Variable declaration
    let owner;
    let investor1;
    let investor2;
    let operator;
    let fundsReceiver;
    let address_zero = "0x0000000000000000000000000000000000000000";


    // Contract Instance Declaration
    let iPolicyRegistry;
    let iSecurityToken;
    let iDefaultSTO;
    let iSTGFactory;
    let iDefaultSTOFactory;

    before(async () => {
        // Accounts setup
        owner = accounts[0];
        investor1 = accounts[1];
        investor2 = accounts[2];
        operator = accounts[9];
        fundsReceiver = accounts[8];

        // Step:1 Create the ecosystem contract instances
        let instances = await DeployContract.deployFactory(owner);
        iPolicyRegistry = instances.iPolicyRegistry;
        iSTGFactory = instances.iSTGFactory;
        iDefaultSTOFactory = instances.iDefaultSTOFactory;

    });

    describe("Generate the SecurityToken", async () => {

        it("Should create ST ok", async () => {
            tx = await iSTGFactory.create(owner, 'Create Security Token', 'DST', 18, 1, {from: owner});
            // console.debug('tx:', tx);
            Log.debug('tx logs args:', tx.logs[0].args);
            assert.equal(tx.receipt.status, 1, "Failed to iSTGFactory.create");

            iSecurityToken = SecurityToken.at(tx.logs[0].args._securityToken);
            res = await iSecurityToken.symbol();
            Log.debug('res:', res);
            assert.equal(res, 'DST', "Failed to iSecurityToken.symbol");
        });

        it("Should create STO ok", async () => {

            let _startTime = Web3Utils.latestTime(web3);
            let _endTime = _startTime + Utils.duration.days(30);
            let _maxAmount = Web3Utils.setAmount(10000000, 18).toNumber();
            let _rate = 10;
            let _minInvestorAmount = Web3Utils.setAmount(1, 18).toNumber();
            let _maxInvestorAmount = Web3Utils.setAmount(10000, 18).toNumber();
            let _maxInvestors = 200;
            let _lockMonths = 12;

            Log.trace('params:', iSecurityToken.address,'', false, [address_zero,fundsReceiver],[_startTime, _endTime, _maxAmount, _rate, _minInvestorAmount, _maxInvestorAmount, _maxInvestors, _lockMonths]);
            tx = await iDefaultSTOFactory.create(iSecurityToken.address,'', false, [address_zero,fundsReceiver],[_startTime, _endTime, _maxAmount, _rate, _minInvestorAmount, _maxInvestorAmount, _maxInvestors, _lockMonths], {from: owner});
            // console.debug('tx:', tx);
            Log.debug('tx logs args:', tx.logs[0].args);
            assert.equal(tx.receipt.status, 1, "Failed to iDefaultSTOFactory.create");
            //
            iDefaultSTO = DefaultSTO.at(tx.logs[0].args._sto);
            res = await iDefaultSTO.name();
            Log.debug('res:', res);
            assert.equal(res, 'DefaultSTO', "Failed to iSecurityToken.name");
        });

    });

});
