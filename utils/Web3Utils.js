var BigNumber = require("bignumber.js");
var utils = require("web3/lib/utils/utils.js");
var SolidityEvent = require("web3/lib/web3/event.js");
var InputDataDecoder = require('./InputDataDecoder');
var Log = require('./LogConsole');

class Web3Utils{

    static decodeEventsForContract(abi, logs) {
        if(!abi || !logs) {
            return logs;
        }
        var decoders = abi.filter(function (json) {
            return json.type === 'event';
        }).map(function(json) {
            // note first and third params only required only by enocde and execute;
            // so don't call those!
            return new SolidityEvent(null, json, null);
        });

        let result = logs.map(function (log) {
            var decoder = decoders.find(function(decoder) {
                return (decoder.signature() == log.topics[0].replace("0x",""));
            })
            if (decoder) {
                // console.log('decoder:',decoder['_params']);
                let types = {};
                for(let i=0; i<decoder['_params'].length; i++) {
                    console.log('decoder _params:',decoder['_params'][i]);
                    types[decoder['_params'][i]['name']]= decoder['_params'][i]['type'];
                }

                log['types'] = types;
                return decoder.decode(log);
            } else {
                console.log('un decoder:',log);
                return log;
            }
        }).map(function (log) {
            let abis = abi.find(function(json) {
                return (json.type === 'event' && log.event === json.name);
            });
            // if (abis && abis.inputs) {
            //     abis.inputs.forEach(function (param, i) {
            //         if (param.type == 'bytes32') {
            //             log.args[param.name] = utils.toAscii(log.args[param.name]);
            //         }
            //     })
            // }
            return log;
        });

        // Log.debug(result);
        return result;
    };

    static decodeInputForContract(abi, data) {
        if(!abi || !data) {
            return data;
        }
        let decoder = new InputDataDecoder(abi);
        let result = decoder.decodeData(data);
        // console.log(result);
        return result;
    }

    static setAmount(amount, precision=18) {
        let bn_precision = new BigNumber(10).pow(precision);
        let bn_amount = new BigNumber(amount);
        bn_amount = bn_amount.times(bn_precision);
        return bn_amount;
    }

    static getAmount(amount, precision=18) {
        let bn_precision = new BigNumber(10).pow(precision);
        let bn_amount = new BigNumber(amount);
        bn_amount = bn_amount.div(bn_precision);
        return bn_amount;
    }

    static latestTime(web3) {
        return web3.eth.getBlock("latest").timestamp;
    }


    static mineBlock(web3, reject, resolve) {
        web3.currentProvider.sendAsync({
            method: "evm_mine",
            jsonrpc: "2.0",
            id: new Date().getTime()
        }, (e) => (e ? reject(e) : resolve()))
    }

    static increaseTimestamp(web3, increase) {
        return new Promise((resolve, reject) => {
            web3.currentProvider.sendAsync({
                method: "evm_increaseTime",
                params: [increase],
                jsonrpc: "2.0",
                id: new Date().getTime()
            }, (e) => (e ? reject(e) : mineBlock(web3, reject, resolve)))
        })
    }

    static balanceOf(web3, account) {
        return new Promise((resolve, reject) => web3.eth.getBalance(account, (e, balance) => (e ? reject(e) : resolve(balance))))
    }

    static async assertThrowsAsynchronously(test, error) {
        try {
            await test();
        } catch(e) {
            if (!error || e instanceof error)
                return "everything is fine";
        }
        throw new Error("Missing rejection" + (error ? " with "+error.name : ""));
    }
}
module.exports = Web3Utils;
