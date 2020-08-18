var Message = require('../common/Message')
var ethUtils = require("ethereumjs-util")
var Web3 = require("web3");
var Log = require('../../utils/LogConsole')
var Web3Utils = require('../../utils/Web3Utils')
var config = require('../config')
var SecurityToken = require('../../build/contracts/SecurityToken.json')
var GeneralPolicy = require('../../build/contracts/GeneralPolicy.json')
var DefaultSTO = require('../../build/contracts/DefaultSTO.json')
var DefaultSTOFactory = require('../../build/contracts/DefaultSTOFactory.json')
var STGFactory = require('../../build/contracts/STGFactory.json')
var RAC = require('../../build/contracts/RAC.json')

// 创建web3对象
var web3 = new Web3();
Log.debug('web3.version:',web3.version);
// 连接到以太坊节点
Log.debug('chainAddress:'+config.httpProvider);
if(!web3.currentProvider) {
    Log.debug("connect...");
    web3.setProvider(new Web3.providers.HttpProvider(config.httpProvider));
} else {
    Log.debug("already connect!");
}
module.exports= class ApiService {
    static verifySign(account, msg, signature) {
        msg += '';
        // console.debug('account:', account);
        // console.debug('msg:', msg);
        // console.debug('signature:', signature);

        if(signature.toLowerCase().substring(0,2) == '0x') {
            signature = signature.substring(2);
        }
        let r = new Buffer(signature.substring(0, 64), 'hex');
        let s = new Buffer(signature.substring(64, 128), 'hex');
        let v = new Buffer((parseInt(signature.substring(128, 130)) + 27).toString());

        // console.debug('r:',r);
        // console.debug('s:',s);
        // console.debug('v:',v);

        let sha3Mag = ethUtils.keccak256(msg);
        console.debug('sha3Mag:', sha3Mag);
        let pubKey=ethUtils.ecrecover(sha3Mag, v, r, s);
        let pubAddr="0x"+ethUtils.publicToAddress(pubKey).toString("hex");
        // console.debug('pubAddr:', pubAddr);
        if(pubAddr.toLowerCase() == account.toLowerCase()){
            return Message.success();
        }

        return Message.fail();
    }

    static async getTransactionReceiptLogs(name, tx) {
        let receipt = await web3.eth.getTransactionReceipt(tx);
        let abi= ApiService.getAbi(name);

        if(!abi) {
            return Message.fail('abi is null');
        }
        if(receipt && receipt.hasOwnProperty('logs')) {
            try {
                receipt.logs = Web3Utils.decodeEventsForContract(abi, receipt.logs);
                return Message.success(receipt);
            } catch (e) {
                Log.error('fail to decodeEventsForContract:', e);
            }

        }
        Log.error('fail to getTransactionReceiptLogs:'+ tx, receipt);
        return Message.fail(receipt);
    }


    static getTransaction(name, tx) {
        let receipt = web3.eth.getTransaction(tx);
        let abi= ApiService.getAbi(name);

        if(!abi) {
            return Message.fail('abi is null');
        }
        if(receipt && receipt.hasOwnProperty('input')) {
            try {
                receipt.input = Web3Utils.decodeInputForContract(abi, receipt.input);
                return Message.success(receipt);
            } catch (e) {
                Log.error('fail to decodeInputForContract:', e);
            }

        }
        Log.error('fail to getTransaction:'+ tx, receipt);
        return Message.fail(receipt);
    }

    static getAbi(name) {
        let abi='';
        if(name=='ST') {
            abi = SecurityToken.abi;
        } else if(name=='GP') {
            abi =  GeneralPolicy.abi;
        } else if(name=='STO') {
            abi =  DefaultSTO.abi;
        } else if(name=='STOFactory') {
            abi =  DefaultSTOFactory.abi;
        } else if(name=='STGFactory') {
            abi =  STGFactory.abi;
        } else if(name=='RAC') {
            abi =  RAC.abi;
        }
        return abi;
    }
}
