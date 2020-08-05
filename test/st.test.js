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
    let address_zero = "0x0000000000000000000000000000000000000000";


    // Contract Instance Declaration
    let iPolicyRegistry;
    let iSecurityToken;
    let iGeneralPolicy;

    before(async () => {
        // Accounts setup
        owner = accounts[0];
        investor1 = accounts[1];
        investor2 = accounts[2];
        operator = accounts[9];

        // Step:1 Create the ecosystem contract instances
        let instances = await DeployContract.deploy(owner);
        iPolicyRegistry = instances.iPolicyRegistry;
        iSecurityToken = instances.iSecurityToken;
        iGeneralPolicy = instances.iGeneralPolicy;

    });

    describe("Base feature the SecurityToken", async () => {

        it("Should intialize the policies", async () => {
            let tx = await iSecurityToken.registryPolicy('', iGeneralPolicy.address, {from: owner});
            assert.equal(tx.receipt.status, 1, "Failed to registryPolicy");
            Log.debug('logs args:', tx.logs[0].args);
            assert.equal(tx.logs[0].args._policy, iGeneralPolicy.address, "Failed to registryPolicy, iGeneralPolicy.address should be ", iGeneralPolicy.address);
            let res = await iSecurityToken.getPolicy('');
            Log.debug('res:', res);
            assert.equal(res, iGeneralPolicy.address, "Failed to registryPolicy/getPolicy, iGeneralPolicy.address should be ", iGeneralPolicy.address);
        });

        it("Should mint the tokens before set whitelist -- fail(invalid)", async () => {
            let fromTime = Web3Utils.latestTime(web3);
            let toTime = fromTime + Utils.duration.days(100);
            let expiryTime = fromTime - Utils.duration.days(100);
            let tx = await iGeneralPolicy.modifyWhitelist('', investor1, fromTime, toTime, expiryTime, true, {
                from: owner,
                gas: 6000000
            });
            assert.equal(tx.logs[0].args._investor, investor1, "Failed in adding the investor in whitelist");
            await catchRevert(iSecurityToken.mint(investor1, Web3Utils.getAmount(100,18).toNumber(), { from: owner }));
        });

        it("Should mint the tokens before set whitelist -- fail(no set) only be called by the owner", async () => {
            await catchRevert(iSecurityToken.mint(investor2, Web3Utils.getAmount(100,18).toNumber(), { from: owner }));
            let balance = await iSecurityToken.balanceOf(investor2);
            Log.debug('balance:', balance);

        });

        it("Should mint the tokens before set whitelist -- success only be called by the owner", async () => {
            let fromTime = Web3Utils.latestTime(web3);
            let toTime = fromTime;
            let expiryTime = fromTime + Utils.duration.days(100);

            let tx = await iGeneralPolicy.modifyWhitelist('', investor2, fromTime, toTime, expiryTime, true, {
                from: owner,
                gas: 6000000
            });

            assert.equal(tx.logs[0].args._investor, investor2, "Failed in adding the investor in whitelist");

            let beforeBalance = await iSecurityToken.balanceOf(investor2);
            beforeBalance = Web3Utils.getAmount(beforeBalance,18).toNumber();
            Log.debug('beforeBalance:', beforeBalance);
            tx  = await iSecurityToken.mint(investor2, Web3Utils.setAmount(100,18).toNumber(), { from: owner });
            Log.debug('logs args:', tx.logs[0].args);
            let afterBalance = await iSecurityToken.balanceOf(investor2);
            afterBalance = Web3Utils.getAmount(afterBalance,18).toNumber();
            Log.debug('afterBalance:', afterBalance);
            assert.equal(afterBalance-beforeBalance, 100, 'Should be 100')

        });

        it("Should mintMulti", async () => {
            let fromTime = Web3Utils.latestTime(web3);
            let toTime = fromTime;
            let expiryTime = fromTime + Utils.duration.days(100);

            let tx = await iGeneralPolicy.modifyWhitelist('', investor1, fromTime, toTime, expiryTime, true, {
                from: owner,
                gas: 6000000
            });

            assert.equal(tx.logs[0].args._investor, investor1, "Failed in adding the investor in whitelist");

            tx = await iSecurityToken.batchMintTranche('', [investor1, investor2], [Web3Utils.setAmount(100,18).toNumber(),Web3Utils.setAmount(200,18).toNumber()], '', {
                from: owner,
                gas: 500000
            })

            Log.debug('logs args:', tx.logs[0].args);
        });

    });

    describe("General Transfer manager Related test cases", async () => {
        // it("Should Fail in transferring the token from one whitelist investor 1 to non whitelist investor 2", async () => {
        //     await catchRevert(iSecurityToken.transfer(investor2, Web3Utils.setAmount(1,18).toNumber(), { from: investor1 }));
        // });

    //
    //     it("Should adjust granularity", async () => {
    //         await I_SecurityToken.changeGranularity(Math.pow(10, 17), { from: token_owner });
    //         await I_SecurityToken.transfer(accounts[7], Math.pow(10, 17), { from: account_investor1, gas: 2500000 });
    //         await I_SecurityToken.transfer(account_investor1, Math.pow(10, 17), { from: accounts[7], gas: 2500000 });
    //     });
    //
        it("Should transfer from policy investor", async () => {
            let fromTime = Web3Utils.latestTime(web3);
            let toTime = fromTime;
            let expiryTime = fromTime + Utils.duration.days(100);
            let tx = await iGeneralPolicy.modifyWhitelist('', investor1, fromTime, toTime, expiryTime, true, {
                from: owner,
                gas: 6000000
            });
            assert.equal(tx.logs[0].args._investor, investor1, "Failed in adding the investor in whitelist");

            tx = await iGeneralPolicy.modifyWhitelist('', investor2, fromTime, toTime, expiryTime, true, {
                from: owner,
                gas: 6000000
            });
            assert.equal(tx.logs[0].args._investor, investor2, "Failed in adding the investor in whitelist");

            tx = await iGeneralPolicy.configHolder('', 200, 80, {
                from: owner,
                gas: 6000000
            });
            Log.debug('configHolder tx:',tx.logs[0].args);
            assert.equal(tx.logs[0].args._newHolderCount, 200, "Failed in adding the investor2 in configHolder");
            assert.equal(tx.logs[0].args._newHolderPercentage, 80, "Failed in adding the investor2 in configHolder");

            let beforeBalance = await iSecurityToken.balanceOfTranche('',investor2);
            beforeBalance = Web3Utils.getAmount(beforeBalance,18).toNumber();
            Log.debug('beforeBalance:', beforeBalance);
            tx = await iSecurityToken.transfer(investor2, Web3Utils.setAmount(1,18).toNumber(), { from: investor1, gas: 2500000 });
            Log.debug('sendTranche tx:',tx.logs[0].args);
            assert.equal(tx.logs[0].args._value, Web3Utils.setAmount(1,18).toNumber(), "Failed in adding the investor in whitelist");
            let afterBalance = await iSecurityToken.balanceOfTranche('',investor2);
            afterBalance = Web3Utils.getAmount(afterBalance,18).toNumber();
            Log.debug('afterBalance:', afterBalance);
            assert.equal(afterBalance-beforeBalance, 1, 'Should be 1');

        });
    //
    //     it("Should bool allowAllTransfer value is false", async () => {
    //         assert.isFalse(await I_GeneralTransferManager.allowAllTransfers.call(), "reverting of snapshot doesn't works properly");
    //     });
    //
    //     it("Should change the bool allowAllWhitelistTransfers to true", async () => {
    //         ID_snap = await takeSnapshot();
    //         let tx = await I_GeneralTransferManager.changeAllowAllWhitelistTransfers(true, { from: account_delegate });
    //
    //         assert.isTrue(tx.logs[0].args._allowAllWhitelistTransfers, "allowAllWhitelistTransfers variable is not successfully updated");
    //     });
    //
    //     it("Should transfer from whitelist investor1 to whitelist investor 2", async () => {
    //         let tx = await I_GeneralTransferManager.modifyWhitelist(account_investor2, fromTime, toTime, expiryTime, true, {
    //             from: token_owner,
    //             gas: 500000
    //         });
    //
    //         assert.equal(tx.logs[0].args._investor, account_investor2, "Failed in adding the investor in whitelist");
    //
    //         await I_SecurityToken.transfer(account_investor2, 10 * Math.pow(10, 18), { from: account_investor1, gas: 2500000 });
    //         assert.equal(
    //             (await I_SecurityToken.balanceOf(account_investor2)).dividedBy(new BigNumber(10).pow(18)).toNumber(),
    //             10,
    //             "Transfer doesn't take place properly"
    //         );
    //     });
    //
    //     it("Should transfer from whitelist investor1 to whitelist investor 2 -- value = 0", async () => {
    //         let tx = await I_SecurityToken.transfer(account_investor2, 0, { from: account_investor1, gas: 2500000 });
    //         assert.equal(tx.logs[0].args.value.toNumber(), 0);
    //     });
    //
        it("Should transferFrom from one investor to other", async () => {
            let tx = await iSecurityToken.approve(operator, Web3Utils.setAmount(1000000,18).toNumber(), { from: investor2 });
            assert.equal(tx.logs[0].args._value, Web3Utils.setAmount(1000000,18).toNumber(), "Failed to approve");

            let res = await iSecurityToken.isOperatorForTranche('',operator,investor2);
            Log.debug('isOperatorForTranche:', res);
            assert.equal(res, true, "Failed to check approve");

            let beforeBalance = await iSecurityToken.balanceOfTranche('',investor2);
            beforeBalance = Web3Utils.getAmount(beforeBalance,18).toNumber();
            Log.debug('beforeBalance:', beforeBalance);
            tx = await iSecurityToken.transferFrom(investor2, investor1, Web3Utils.setAmount(1,18).toNumber(), {
                from: operator
            });
            Log.debug('transferFrom tx:',tx.logs[0].args);
            assert.equal(tx.logs[0].args._value, Web3Utils.setAmount(1,18).toNumber(), "Failed to transferFrom");
            let afterBalance = await iSecurityToken.balanceOfTranche('',investor2);
            afterBalance = Web3Utils.getAmount(afterBalance,18).toNumber();
            Log.debug('afterBalance:', afterBalance);
            assert.equal(beforeBalance-afterBalance, 1, 'Should be 1');

        });

    //     it("Should Fail in trasferring from whitelist investor1 to non-whitelist investor", async () => {
    //         await catchRevert(I_SecurityToken.transfer(account_temp, 10 * Math.pow(10, 18), { from: account_investor1, gas: 2500000 }));
    //         await revertToSnapshot(ID_snap);
    //     });
    //
    //     it("Should successfully mint tokens while STO attached", async () => {
    //         await I_SecurityToken.mint(account_affiliate1, 100 * Math.pow(10, 18), { from: token_owner, gas: 500000 });
    //         let balance = await I_SecurityToken.balanceOf(account_affiliate1);
    //         assert.equal(balance.dividedBy(new BigNumber(10).pow(18)).toNumber(), 400);
    //     });
    //
    //     it("Should mint the tokens for multiple afiliated investors while STO attached", async () => {
    //         await I_SecurityToken.mintMulti([account_affiliate1, account_affiliate2], [100 * Math.pow(10, 18), 110 * Math.pow(10, 18)], {
    //             from: token_owner,
    //             gas: 500000
    //         });
    //         let balance1 = await I_SecurityToken.balanceOf(account_affiliate1);
    //         assert.equal(balance1.dividedBy(new BigNumber(10).pow(18)).toNumber(), 500);
    //         let balance2 = await I_SecurityToken.balanceOf(account_affiliate2);
    //         assert.equal(balance2.dividedBy(new BigNumber(10).pow(18)).toNumber(), 220);
    //     });
    //
    //     it("Should provide more permissions to the delegate", async () => {
    //         // Providing the permission to the delegate
    //         await I_GeneralPermissionManager.changePermission(account_delegate, I_GeneralTransferManager.address, TM_Perm_Whitelist, true, {
    //             from: token_owner
    //         });
    //
    //         assert.isTrue(
    //             await I_GeneralPermissionManager.checkPermission(account_delegate, I_GeneralTransferManager.address, TM_Perm_Whitelist)
    //         );
    //     });
    //
    //     it("Should add the investor in the whitelist by the delegate", async () => {
    //         let tx = await I_GeneralTransferManager.modifyWhitelist(account_temp, fromTime, toTime, expiryTime, true, {
    //             from: account_delegate,
    //             gas: 6000000
    //         });
    //
    //         assert.equal(tx.logs[0].args._investor, account_temp, "Failed in adding the investor in whitelist");
    //     });
    //
    //     it("should account_temp successfully buy the token", async () => {
    //         // Fallback transaction
    //         await web3.eth.sendTransaction({
    //             from: account_temp,
    //             to: I_CappedSTO.address,
    //             gas: 2100000,
    //             value: web3.utils.toWei("1", "ether")
    //         });
    //
    //         assert.equal((await I_CappedSTO.getRaised.call(0)).dividedBy(new BigNumber(10).pow(18)).toNumber(), 2);
    //
    //         assert.equal(await I_CappedSTO.investorCount.call(), 2);
    //
    //         assert.equal((await I_SecurityToken.balanceOf(account_investor1)).dividedBy(new BigNumber(10).pow(18)).toNumber(), 1000);
    //     });
    //
    //     it("STO should fail to mint tokens after minting is frozen", async () => {
    //         let id = await takeSnapshot();
    //         await I_SecurityToken.freezeMinting({ from: token_owner });
    //
    //         await catchRevert(
    //             web3.eth.sendTransaction({
    //                 from: account_temp,
    //                 to: I_CappedSTO.address,
    //                 gas: 2100000,
    //                 value: web3.utils.toWei("1", "ether")
    //             })
    //         );
    //         await revertToSnapshot(id);
    //     });
    //
    //     it("Should remove investor from the whitelist by the delegate", async () => {
    //         let tx = await I_GeneralTransferManager.modifyWhitelist(account_temp, 0, 0, 0, true, {
    //             from: account_delegate,
    //             gas: 6000000
    //         });
    //
    //         assert.equal(tx.logs[0].args._investor, account_temp, "Failed in removing the investor from whitelist");
    //     });
    //
    //     it("should account_temp fail in buying the token", async () => {
    //         await catchRevert(
    //             web3.eth.sendTransaction({
    //                 from: account_temp,
    //                 to: I_CappedSTO.address,
    //                 gas: 2100000,
    //                 value: web3.utils.toWei("1", "ether")
    //             })
    //         );
    //     });
    //
    //     it("Should freeze the transfers", async () => {
    //         let tx = await I_SecurityToken.freezeTransfers({ from: token_owner });
    //         assert.isTrue(tx.logs[0].args._status);
    //     });
    //
    //     it("Should fail to freeze the transfers", async () => {
    //         await catchRevert(I_SecurityToken.freezeTransfers({ from: token_owner }));
    //     });
    //
    //     it("Should fail in buying to tokens", async () => {
    //         let tx = await I_GeneralTransferManager.modifyWhitelist(account_temp, fromTime, toTime, expiryTime, true, {
    //             from: account_delegate,
    //             gas: 6000000
    //         });
    //
    //         assert.equal(tx.logs[0].args._investor, account_temp, "Failed in adding the investor in whitelist");
    //
    //         await catchRevert(
    //             web3.eth.sendTransaction({
    //                 from: account_temp,
    //                 to: I_CappedSTO.address,
    //                 gas: 2100000,
    //                 value: web3.utils.toWei("1", "ether")
    //             })
    //         );
    //     });
    //
    //     it("Should fail in trasfering the tokens from one user to another", async () => {
    //         await I_GeneralTransferManager.changeAllowAllWhitelistTransfers(true, { from: token_owner });
    //         console.log(await I_SecurityToken.balanceOf(account_investor1));
    //
    //         await catchRevert(I_SecurityToken.transfer(account_investor1, web3.utils.toWei("1", "ether"), { from: account_temp }));
    //     });
    //
    //     it("Should unfreeze all the transfers", async () => {
    //         let tx = await I_SecurityToken.unfreezeTransfers({ from: token_owner });
    //         assert.isFalse(tx.logs[0].args._status);
    //     });
    //
    //     it("Should freeze the transfers", async () => {
    //         await catchRevert(I_SecurityToken.unfreezeTransfers({ from: token_owner }));
    //     });
    //
    //     it("Should able to transfers the tokens from one user to another", async () => {
    //         await I_SecurityToken.transfer(account_investor1, web3.utils.toWei("1", "ether"), { from: account_temp });
    //     });
    //
    //     it("Should check that the list of investors is correct", async () => {
    //         // Hardcode list of expected accounts based on transfers above
    //
    //         let investors = await I_SecurityToken.getInvestors();
    //         let expectedAccounts = [account_affiliate1, account_affiliate2, account_investor1, account_temp];
    //         for (let i = 0; i < expectedAccounts.length; i++) {
    //             assert.equal(investors[i], expectedAccounts[i]);
    //         }
    //         assert.equal(investors.length, 4);
    //         console.log("Total Seen Investors: " + investors.length);
    //     });
    //
    //     it("Should fail to set controller status because msg.sender not owner", async () => {
    //         await catchRevert(I_SecurityToken.setController(account_controller, { from: account_controller }));
    //     });
    //
    //     it("Should successfully set controller", async () => {
    //         let tx1 = await I_SecurityToken.setController(account_controller, { from: token_owner });
    //
    //         // check event
    //         assert.equal(address_zero, tx1.logs[0].args._oldController, "Event not emitted as expected");
    //         assert.equal(account_controller, tx1.logs[0].args._newController, "Event not emitted as expected");
    //
    //         let tx2 = await I_SecurityToken.setController(address_zero, { from: token_owner });
    //
    //         // check event
    //         assert.equal(account_controller, tx2.logs[0].args._oldController, "Event not emitted as expected");
    //         assert.equal(address_zero, tx2.logs[0].args._newController, "Event not emitted as expected");
    //
    //         let tx3 = await I_SecurityToken.setController(account_controller, { from: token_owner });
    //
    //         // check event
    //         assert.equal(address_zero, tx3.logs[0].args._oldController, "Event not emitted as expected");
    //         assert.equal(account_controller, tx3.logs[0].args._newController, "Event not emitted as expected");
    //
    //         // check status
    //         let controller = await I_SecurityToken.controller.call();
    //         assert.equal(account_controller, controller, "Status not set correctly");
    //     });
    //
    //     it("Should force burn the tokens - value too high", async () => {
    //         await I_GeneralTransferManager.changeAllowAllBurnTransfers(true, { from: token_owner });
    //         let currentInvestorCount = await I_SecurityToken.getInvestorCount.call();
    //         let currentBalance = await I_SecurityToken.balanceOf(account_temp);
    //         await catchRevert(
    //             I_SecurityToken.forceBurn(account_temp, currentBalance + web3.utils.toWei("500", "ether"), "", "", {
    //                 from: account_controller
    //             })
    //         );
    //     });
    //     it("Should force burn the tokens - wrong caller", async () => {
    //         await I_GeneralTransferManager.changeAllowAllBurnTransfers(true, { from: token_owner });
    //         let currentInvestorCount = await I_SecurityToken.getInvestorCount.call();
    //         let currentBalance = await I_SecurityToken.balanceOf(account_temp);
    //         await catchRevert(I_SecurityToken.forceBurn(account_temp, currentBalance, "", "", { from: token_owner }));
    //     });
    //
    //     it("Should burn the tokens", async () => {
    //         let currentInvestorCount = await I_SecurityToken.getInvestorCount.call();
    //         let currentBalance = await I_SecurityToken.balanceOf(account_temp);
    //         // console.log(currentInvestorCount.toString(), currentBalance.toString());
    //         let tx = await I_SecurityToken.forceBurn(account_temp, currentBalance, "", "", { from: account_controller });
    //         // console.log(tx.logs[0].args._value.toNumber(), currentBalance.toNumber());
    //         assert.equal(tx.logs[0].args._value.toNumber(), currentBalance.toNumber());
    //         let newInvestorCount = await I_SecurityToken.getInvestorCount.call();
    //         // console.log(newInvestorCount.toString());
    //         assert.equal(newInvestorCount.toNumber() + 1, currentInvestorCount.toNumber(), "Investor count drops by one");
    //     });
    //
    //     it("Should use getInvestorsAt to determine balances now", async () => {
    //         await I_SecurityToken.createCheckpoint({ from: token_owner });
    //         let investors = await I_SecurityToken.getInvestorsAt.call(1);
    //         console.log("Filtered investors:" + investors);
    //         let expectedAccounts = [account_affiliate1, account_affiliate2, account_investor1];
    //         for (let i = 0; i < expectedAccounts.length; i++) {
    //             assert.equal(investors[i], expectedAccounts[i]);
    //         }
    //         assert.equal(investors.length, 3);
    //     });
    //
    //     it("Should prune investor length test #2", async () => {
    //         let balance = await I_SecurityToken.balanceOf(account_affiliate2);
    //         let balance2 = await I_SecurityToken.balanceOf(account_investor1);
    //         await I_SecurityToken.transfer(account_affiliate1, balance, { from: account_affiliate2});
    //         await I_SecurityToken.transfer(account_affiliate1, balance2, { from: account_investor1});
    //         await I_SecurityToken.createCheckpoint({ from: token_owner });
    //         let investors = await I_SecurityToken.getInvestors.call();
    //         console.log("All investors:" + investors);
    //         let expectedAccounts = [account_affiliate1, account_affiliate2, account_investor1, account_temp];
    //         for (let i = 0; i < expectedAccounts.length; i++) {
    //             assert.equal(investors[i], expectedAccounts[i]);
    //         }
    //         assert.equal(investors.length, 4);
    //         investors = await I_SecurityToken.getInvestorsAt.call(2);
    //         console.log("Filtered investors:" + investors);
    //         expectedAccounts = [account_affiliate1];
    //         for (let i = 0; i < expectedAccounts.length; i++) {
    //             assert.equal(investors[i], expectedAccounts[i]);
    //         }
    //         assert.equal(investors.length, 1);
    //         await I_SecurityToken.transfer(account_affiliate2, balance, { from: account_affiliate1});
    //         await I_SecurityToken.transfer(account_investor1, balance2, { from: account_affiliate1});
    //     });
    //
    //     it("Should get filtered investors", async () => {
    //         let investors = await I_SecurityToken.getInvestors.call();
    //         console.log("All Investors: " + investors);
    //         let filteredInvestors = await I_SecurityToken.iterateInvestors.call(0, 1);
    //         console.log("Filtered Investors (0, 1): " + filteredInvestors);
    //         assert.equal(filteredInvestors[0], investors[0]);
    //         assert.equal(filteredInvestors.length, 1);
    //         filteredInvestors = await I_SecurityToken.iterateInvestors.call(2, 4);
    //         console.log("Filtered Investors (2, 4): " + filteredInvestors);
    //         assert.equal(filteredInvestors[0], investors[2]);
    //         assert.equal(filteredInvestors[1], investors[3]);
    //         assert.equal(filteredInvestors.length, 2);
    //         filteredInvestors = await I_SecurityToken.iterateInvestors.call(0, 4);
    //         console.log("Filtered Investors (0, 4): " + filteredInvestors);
    //         assert.equal(filteredInvestors[0], investors[0]);
    //         assert.equal(filteredInvestors[1], investors[1]);
    //         assert.equal(filteredInvestors[2], investors[2]);
    //         assert.equal(filteredInvestors[3], investors[3]);
    //         assert.equal(filteredInvestors.length, 4);
    //         await catchRevert(
    //             I_SecurityToken.iterateInvestors(0, 5)
    //         );
    //     });
    //
    //     it("Should check the balance of investor at checkpoint", async () => {
    //         await catchRevert(I_SecurityToken.balanceOfAt(account_investor1, 5));
    //     });
    //
    //     it("Should check the balance of investor at checkpoint", async () => {
    //         let balance = await I_SecurityToken.balanceOfAt(account_investor1, 0);
    //         assert.equal(balance.toNumber(), 0);
    //     });
    });

    // describe("Test cases for the Mock TrackedRedeemption", async() => {
    //
    //     it("Should add the tracked redeemption module successfully", async() => {
    //         [I_MockRedemptionManagerFactory] = await deployMockRedemptionAndVerifyed(account_polymath, I_MRProxied, I_PolyToken.address, 0);
    //         let tx = await I_SecurityToken.addModule(I_MockRedemptionManagerFactory.address, "", 0, 0, {from: token_owner });
    //         assert.equal(tx.logs[2].args._types[0], burnKey, "fail in adding the burn manager");
    //         I_MockRedemptionManager = MockRedemptionManager.at(tx.logs[2].args._module);
    //         // adding the burn module into the GTM
    //         tx = await I_GeneralTransferManager.modifyWhitelist(
    //             I_MockRedemptionManager.address,
    //             latestTime(),
    //             latestTime() + duration.seconds(2),
    //             latestTime() + duration.days(50),
    //             true,
    //             {
    //                 from: account_delegate,
    //                 gas: 6000000
    //             }
    //         );
    //         assert.equal(tx.logs[0].args._investor, I_MockRedemptionManager.address, "Failed in adding the investor in whitelist");
    //     });
    //
    //     it("Should successfully burn tokens", async() => {
    //         await I_GeneralTransferManager.changeAllowAllWhitelistTransfers(false, {from: token_owner});
    //         // Minting some tokens
    //         await I_SecurityToken.mint(account_investor1, web3.utils.toWei("1000"), {from: token_owner});
    //         // Provide approval to trnafer the tokens to Module
    //         await I_SecurityToken.approve(I_MockRedemptionManager.address, web3.utils.toWei("500"), {from: account_investor1});
    //         // Allow all whitelist transfer
    //         await I_GeneralTransferManager.changeAllowAllWhitelistTransfers(true, {from: token_owner});
    //         // Transfer the tokens to module (Burn)
    //         await I_MockRedemptionManager.transferToRedeem(web3.utils.toWei("500"), { from: account_investor1});
    //         // Redeem tokens
    //         let tx = await I_MockRedemptionManager.redeemTokenByOwner(web3.utils.toWei("250"), {from: account_investor1});
    //         assert.equal(tx.logs[0].args._investor, account_investor1, "Burn tokens of wrong owner");
    //         assert.equal((tx.logs[0].args._value).dividedBy(new BigNumber(10).pow(18)).toNumber(), 250);
    //     });
    //
    //     it("Should fail to burn the tokens because module get archived", async() => {
    //         await I_SecurityToken.archiveModule(I_MockRedemptionManager.address, {from: token_owner});
    //         await catchRevert(
    //             I_MockRedemptionManager.redeemTokenByOwner(web3.utils.toWei("250"), {from: account_investor1})
    //         );
    //     })
    //
    //     it("Should successfully fail in calling the burn functions", async() => {
    //         [I_MockRedemptionManagerFactory] = await deployMockWrongTypeRedemptionAndVerifyed(account_polymath, I_MRProxied, I_PolyToken.address, 0);
    //         let tx = await I_SecurityToken.addModule(I_MockRedemptionManagerFactory.address, "", 0, 0, {from: token_owner });
    //         I_MockRedemptionManager = MockRedemptionManager.at(tx.logs[2].args._module);
    //
    //         // adding the burn module into the GTM
    //         tx = await I_GeneralTransferManager.modifyWhitelist(
    //             I_MockRedemptionManager.address,
    //             latestTime(),
    //             latestTime() + duration.seconds(2),
    //             latestTime() + duration.days(50),
    //             true,
    //             {
    //                 from: account_delegate,
    //                 gas: 6000000
    //             }
    //         );
    //         assert.equal(tx.logs[0].args._investor, I_MockRedemptionManager.address, "Failed in adding the investor in whitelist");
    //         // Provide approval to trnafer the tokens to Module
    //         await I_SecurityToken.approve(I_MockRedemptionManager.address, web3.utils.toWei("500"), {from: account_investor1});
    //         // Transfer the tokens to module (Burn)
    //         await I_MockRedemptionManager.transferToRedeem(web3.utils.toWei("500"), { from: account_investor1});
    //
    //         await catchRevert(
    //             // Redeem tokens
    //             I_MockRedemptionManager.redeemTokenByOwner(web3.utils.toWei("250"), {from: account_investor1})
    //         );
    //     });
    //
    // })
    //
    // describe("Withdraw Poly", async () => {
    //     it("Should successfully withdraw the poly -- failed because of zero address of token", async() => {
    //         await catchRevert(I_SecurityToken.withdrawERC20("0x00000000000000000000000000000000000000000", web3.utils.toWei("20000", "ether"), { from: account_temp }));
    //     })
    //
    //     it("Should successfully withdraw the poly", async () => {
    //         await catchRevert(I_SecurityToken.withdrawERC20(I_PolyToken.address, web3.utils.toWei("20000", "ether"), { from: account_temp }));
    //     });
    //
    //     it("Should successfully withdraw the poly", async () => {
    //         let balanceBefore = await I_PolyToken.balanceOf(token_owner);
    //         await I_SecurityToken.withdrawERC20(I_PolyToken.address, web3.utils.toWei("20000", "ether"), { from: token_owner });
    //         let balanceAfter = await I_PolyToken.balanceOf(token_owner);
    //         assert.equal(
    //             BigNumber(balanceAfter)
    //                 .sub(new BigNumber(balanceBefore))
    //                 .toNumber(),
    //             web3.utils.toWei("20000", "ether")
    //         );
    //     });
    //
    //     it("Should successfully withdraw the poly", async () => {
    //         await catchRevert(I_SecurityToken.withdrawERC20(I_PolyToken.address, web3.utils.toWei("10", "ether"), { from: token_owner }));
    //     });
    // });
    //
    // describe("Force Transfer", async () => {
    //     it("Should fail to forceTransfer because not approved controller", async () => {
    //         await catchRevert(
    //             I_SecurityToken.forceTransfer(account_investor1, account_investor2, web3.utils.toWei("10", "ether"), "", "reason", {
    //                 from: account_investor1
    //             })
    //         );
    //     });
    //
    //     it("Should fail to forceTransfer because insufficient balance", async () => {
    //         await catchRevert(
    //             I_SecurityToken.forceTransfer(account_investor2, account_investor1, web3.utils.toWei("10", "ether"), "", "reason", {
    //                 from: account_controller
    //             })
    //         );
    //     });
    //
    //     it("Should fail to forceTransfer because recipient is zero address", async () => {
    //         await catchRevert(
    //             I_SecurityToken.forceTransfer(account_investor1, address_zero, web3.utils.toWei("10", "ether"), "", "reason", {
    //                 from: account_controller
    //             })
    //         );
    //     });
    //
    //     it("Should successfully forceTransfer", async () => {
    //         let sender = account_investor1;
    //         let receiver = account_investor2;
    //
    //         let start_investorCount = await I_SecurityToken.getInvestorCount.call();
    //         let start_balInv1 = await I_SecurityToken.balanceOf.call(account_investor1);
    //         let start_balInv2 = await I_SecurityToken.balanceOf.call(account_investor2);
    //
    //         let tx = await I_SecurityToken.forceTransfer(
    //             account_investor1,
    //             account_investor2,
    //             web3.utils.toWei("10", "ether"),
    //             "",
    //             "reason",
    //             { from: account_controller }
    //         );
    //
    //         let end_investorCount = await I_SecurityToken.getInvestorCount.call();
    //         let end_balInv1 = await I_SecurityToken.balanceOf.call(account_investor1);
    //         let end_balInv2 = await I_SecurityToken.balanceOf.call(account_investor2);
    //
    //         assert.equal(start_investorCount.add(1).toNumber(), end_investorCount.toNumber(), "Investor count not changed");
    //         assert.equal(
    //             start_balInv1.sub(web3.utils.toWei("10", "ether")).toNumber(),
    //             end_balInv1.toNumber(),
    //             "Investor balance not changed"
    //         );
    //         assert.equal(
    //             start_balInv2.add(web3.utils.toWei("10", "ether")).toNumber(),
    //             end_balInv2.toNumber(),
    //             "Investor balance not changed"
    //         );
    //         console.log(tx.logs[0].args);
    //         console.log(tx.logs[1].args);
    //         assert.equal(account_controller, tx.logs[0].args._controller, "Event not emitted as expected");
    //         assert.equal(account_investor1, tx.logs[0].args._from, "Event not emitted as expected");
    //         assert.equal(account_investor2, tx.logs[0].args._to, "Event not emitted as expected");
    //         assert.equal(web3.utils.toWei("10", "ether"), tx.logs[0].args._value, "Event not emitted as expected");
    //         console.log(tx.logs[0].args._verifyTransfer);
    //         assert.equal(false, tx.logs[0].args._verifyTransfer, "Event not emitted as expected");
    //         assert.equal("reason", web3.utils.hexToUtf8(tx.logs[0].args._data), "Event not emitted as expected");
    //
    //         assert.equal(account_investor1, tx.logs[1].args.from, "Event not emitted as expected");
    //         assert.equal(account_investor2, tx.logs[1].args.to, "Event not emitted as expected");
    //         assert.equal(web3.utils.toWei("10", "ether"), tx.logs[1].args.value, "Event not emitted as expected");
    //     });
    //
    //     it("Should fail to freeze controller functionality because not owner", async () => {
    //         await catchRevert(I_SecurityToken.disableController({ from: account_investor1 }));
    //     });
    //
    //     it("Should fail to freeze controller functionality because disableControllerAllowed not activated", async () => {
    //         await catchRevert(I_SecurityToken.disableController({ from: token_owner }));
    //     });
    //
    //     it("Should successfully freeze controller functionality", async () => {
    //         let tx1 = await I_FeatureRegistry.setFeatureStatus("disableControllerAllowed", true, { from: account_polymath });
    //
    //         // check event
    //         assert.equal("disableControllerAllowed", tx1.logs[0].args._nameKey, "Event not emitted as expected");
    //         assert.equal(true, tx1.logs[0].args._newStatus, "Event not emitted as expected");
    //
    //         let tx2 = await I_SecurityToken.disableController({ from: token_owner });
    //
    //         // check state
    //         assert.equal(address_zero, await I_SecurityToken.controller.call(), "State not changed");
    //         assert.equal(true, await I_SecurityToken.controllerDisabled.call(), "State not changed");
    //     });
    //
    //     it("Should fail to freeze controller functionality because already frozen", async () => {
    //         await catchRevert(I_SecurityToken.disableController({ from: token_owner }));
    //     });
    //
    //     it("Should fail to set controller because controller functionality frozen", async () => {
    //         await catchRevert(I_SecurityToken.setController(account_controller, { from: token_owner }));
    //     });
    //
    //     it("Should fail to forceTransfer because controller functionality frozen", async () => {
    //         await catchRevert(
    //             I_SecurityToken.forceTransfer(account_investor1, account_investor2, web3.utils.toWei("10", "ether"), "", "reason", {
    //                 from: account_controller
    //             })
    //         );
    //     });
    // });

});
