const DeployContract = require("./common/deployContract");
const Utils = require("./common/utils");
const Web3 = require("web3");
const Web3Utils = require('../utils/Web3Utils');
const Log = require('../utils/LogConsole');
var { catchRevert } = require("./common/exceptions");
const BigNumber = require("bignumber.js");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Hardcoded development port

contract("SecurityToken", accounts => {
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
    let iGeneralPolicy;
    let iDefaultSTO;

    let rate = 10;

    before(async () => {
        // Accounts setup
        owner = accounts[0];
        investor1 = accounts[1];
        investor2 = accounts[2];
        operator = accounts[9];
        fundsReceiver = accounts[8];

        // Step:1 Create the ecosystem contract instances
        let instances = await DeployContract.deploy(owner);
        iPolicyRegistry = instances.iPolicyRegistry;
        iSecurityToken = instances.iSecurityToken;
        iGeneralPolicy = instances.iGeneralPolicy;
        iDefaultSTO = await DeployContract.deployDefaultSTO(owner, iSecurityToken.address);

        let tx = await iSecurityToken.registryPolicy('', iGeneralPolicy.address, {from: owner});
        assert.equal(tx.receipt.status, 1, "Failed to registryPolicy");

    });

    describe("Test STO For ETH", async () => {


        it("Should successfully to call configure", async () => {
            let _startTime = Web3Utils.latestTime(web3);
            let _endTime = _startTime + Utils.duration.days(30);
            let _maxAmount = Web3Utils.setAmount(100000000, 18).toNumber();
            let _rate = rate;
            let _minInvestorAmount = Web3Utils.setAmount(1, 18).toNumber();
            let _maxInvestorAmount = Web3Utils.setAmount(10000, 18).toNumber();
            let _maxInvestors = 200;
            let _lockMonths = 12;

            Log.trace('params:','', false, [address_zero,fundsReceiver],[_startTime, _endTime, _maxAmount, _rate, _minInvestorAmount, _maxInvestorAmount, _maxInvestors, _lockMonths]);
            let tx = await iDefaultSTO.configure('', false, [address_zero,fundsReceiver],[_startTime, _endTime, _maxAmount, _rate, _minInvestorAmount, _maxInvestorAmount, _maxInvestors, _lockMonths], {from: owner});
            Log.debug('tx', tx.receipt);
            assert.equal(tx.receipt.status, 1, "Failed to configure");

        });

        it("Should successfully to call buy", async () => {
            let fromTime = Web3Utils.latestTime(web3);
            let toTime = fromTime;
            let expiryTime = fromTime + Utils.duration.days(100);

            let tx = await iGeneralPolicy.modifyWhitelist('', investor1, fromTime, toTime, expiryTime, true, {
                from: owner,
                gas: 6000000
            });

            assert.equal(tx.logs[0].args._investor, investor1, "Failed in adding the investor in whitelist");

            tx = await iGeneralPolicy.modifyWhitelist('', fundsReceiver, fromTime, toTime, expiryTime, true, {
                from: owner,
                gas: 6000000
            });

            assert.equal(tx.logs[0].args._investor, fundsReceiver, "Failed in adding the fundsReceiver in whitelist");


            let amount = 10;
            let beforeBalance = await iSecurityToken.balanceOf(investor1);
            beforeBalance = Web3Utils.getAmount(beforeBalance,18).toNumber();
            Log.debug('beforeBalance:', beforeBalance);

            let beforeFundsReceiverBalance = await web3.eth.getBalance(fundsReceiver);
            beforeFundsReceiverBalance = Web3Utils.getAmount(beforeFundsReceiverBalance,18).toNumber();
            Log.debug('beforeFundsReceiverBalance:', beforeFundsReceiverBalance);

            tx = await iDefaultSTO.buy({
                value: Web3Utils.setAmount(amount,18).toNumber(),
                from: investor1
            });
            Log.debug('tx', tx.logs[0]);
            assert.equal(tx.receipt.status, 1, "Failed to buy");

            let afterBalance = await iSecurityToken.balanceOf(investor1);
            afterBalance = Web3Utils.getAmount(afterBalance,18).toNumber();
            Log.debug('afterBalance:', afterBalance);

            let afterFundsReceiverBalance = await await web3.eth.getBalance(fundsReceiver);
            afterFundsReceiverBalance = Web3Utils.getAmount(afterFundsReceiverBalance,18).toNumber();
            Log.debug('afterFundsReceiverBalance:', afterFundsReceiverBalance);

            assert.equal(afterBalance-beforeBalance, amount*rate, 'Token should be '+amount*rate)
            assert.equal(afterFundsReceiverBalance-beforeFundsReceiverBalance, amount, 'ETH should be '+amount)

        })
    });


    describe("Test STO For Token", async () => {

        it("Should successfully to call configure", async () => {
            let _startTime = Web3Utils.latestTime(web3);
            let _endTime = _startTime + Utils.duration.days(30);
            let _maxAmount = Web3Utils.setAmount(100000000, 18).toNumber();
            let _rate = rate;
            let _minInvestorAmount = Web3Utils.setAmount(1, 18).toNumber();
            let _maxInvestorAmount = Web3Utils.setAmount(10000, 18).toNumber();
            let _maxInvestors = 200;
            let _lockMonths = 12;

            Log.trace('params:','', false, [iSecurityToken.address,fundsReceiver],[_startTime, _endTime, _maxAmount, _rate, _minInvestorAmount, _maxInvestorAmount, _maxInvestors, _lockMonths]);
            let tx = await iDefaultSTO.configure('', false, [iSecurityToken.address,fundsReceiver],[_startTime, _endTime, _maxAmount, _rate, _minInvestorAmount, _maxInvestorAmount, _maxInvestors, _lockMonths], {from: owner});
            Log.debug('tx', tx.receipt);
            assert.equal(tx.receipt.status, 1, "Failed to configure");

        });

        it("Should successfully to call buy", async () => {
            let fromTime = Web3Utils.latestTime(web3);
            let toTime = fromTime;
            let expiryTime = fromTime + Utils.duration.days(100);

            let tx = await iGeneralPolicy.modifyWhitelist('', investor1, fromTime, toTime, expiryTime, true, {
                from: owner,
                gas: 6000000
            });

            assert.equal(tx.logs[0].args._investor, investor1, "Failed in adding the investor in whitelist");

            tx = await iGeneralPolicy.modifyWhitelist('', fundsReceiver, fromTime, toTime, expiryTime, true, {
                from: owner,
                gas: 6000000
            });

            assert.equal(tx.logs[0].args._investor, fundsReceiver, "Failed in adding the fundsReceiver in whitelist");


            tx = await iSecurityToken.mint(investor1, Web3Utils.setAmount(100000,18).toNumber(), {
                from: owner
            });
            Log.debug('tx', tx.logs[0]);
            assert.equal(tx.receipt.status, 1, "Failed to buy");

            tx = await iSecurityToken.approve(iDefaultSTO.address, Web3Utils.setAmount(1000000,18).toNumber(), { from: investor1 });
            Log.debug('tx:', tx.receipt);
            assert.equal(tx.logs[0].args._value, Web3Utils.setAmount(1000000,18).toNumber(), "Failed to approve");


            let amount = 10;
            let beforeBalance = await iSecurityToken.balanceOf(investor1);
            beforeBalance = Web3Utils.getAmount(beforeBalance,18).toNumber();
            Log.debug('beforeBalance:', beforeBalance);

            let beforeFundsReceiverBalance = await web3.eth.getBalance(fundsReceiver);
            beforeFundsReceiverBalance = Web3Utils.getAmount(beforeFundsReceiverBalance,18).toNumber();
            Log.debug('beforeFundsReceiverBalance:', beforeFundsReceiverBalance);

            tx = await iDefaultSTO.buyWithToken(Web3Utils.setAmount(amount,18).toNumber(), {
                from: investor1
            });
            Log.debug('tx', tx.logs[0]);
            assert.equal(tx.receipt.status, 1, "Failed to buy");

            let afterBalance = await iSecurityToken.balanceOf(investor1);
            afterBalance = Web3Utils.getAmount(afterBalance,18).toNumber();
            Log.debug('afterBalance:', afterBalance);

            let afterFundsReceiverBalance = await await web3.eth.getBalance(fundsReceiver);
            afterFundsReceiverBalance = Web3Utils.getAmount(afterFundsReceiverBalance,18).toNumber();
            Log.debug('afterFundsReceiverBalance:', afterFundsReceiverBalance);
            //
            // assert.equal(afterBalance-beforeBalance, amount*rate, 'Should be '+amount*rate)
            // assert.equal(afterFundsReceiverBalance-beforeFundsReceiverBalance, amount, 'Should be '+amount)

        })
    });
});
