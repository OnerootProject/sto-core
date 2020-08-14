function checkWeb3Plugin() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log("Use Mist/MetaMask's provider");
        web3 = new Web3(web3.currentProvider);
        return web3.currentProvider.isMetaMask;
    } else {
        console.log('No web3? Please install MetaMask first!');
        return false;
    }
}

function checkWeb3Account() {
    var account = web3.eth.accounts[0];
    console.log('account:', account);
    return account;
}

async function getWeb3Nonce(owner) {
    return new Promise((resolve, reject) => {
        if(!web3) {
            reject(false);
        } else {
            web3.eth.getTransactionCount(owner, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        }

    });
}


async function getGasPrice() {
    return new Promise((resolve, reject) => {
        if(!web3) {
            reject(false);
        } else {
            web3.eth.getGasPrice((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        }

    });

}

async function ethSign(owner, value) {
    value += '';
    console.log('value:',value);
    var _sha3Msg = web3.sha3(value);
    console.log('_sha3Msg:',_sha3Msg);
    return new Promise((resolve, reject) => {
        if(!web3) {
            reject(false);
        } else {
            web3.eth.sign(owner, _sha3Msg, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        }

    });
}

function getWeb3Account() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        console.log("Use Mist/MetaMask's provider, version:", web3.version);
        web3 = new Web3(web3.currentProvider);
        if(!web3.currentProvider.isMetaMask) {
            return {
                code: 10,
                msg: 'Please wait a moment,try again',
                data: ''
            }
        }
    } else {
        console.log('No web3? Please install MetaMask first!');
        return {
            code: 11,
            msg: 'No web3? Please install MetaMask first!',
            data: ''
        }
    }

    var account = web3.eth.accounts[0];
    console.log('account:', account);
    if(!account) {
        return {
            code: 12,
            msg: 'No wallet, Please login MetaMask first; and make sure you have at least one wallet!',
            data: ''
        }
    }

    return {
        code: 0,
        msg: 'success',
        data: account
    }

}

async function getEthNetWork() {
    return new Promise((resolve, reject) => {
        if(!web3) {
            reject(false);
        } else {
            web3.version.getNetwork((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        }

    });

}

async function getTransactionReceipt(tx) {
    return new Promise((resolve, reject) => {
        if(!web3) {
            reject(false);
        } else {
            web3.eth.getTransactionReceipt(tx, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        }

    });
}

async function getTransaction(tx) {
    return new Promise((resolve, reject) => {
        if(!web3) {
            reject(false);
        } else {
            web3.eth.getTransaction(tx, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        }

    });
}

async function getBlock(block) {
    return new Promise((resolve, reject) => {
        if(!web3) {
            reject(false);
        } else {
            web3.eth.getBlock(block, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        }

    });
}


function decodeEventsForContract(abi, logs) {
    var SolidityEvent = require("web3/lib/web3/event.js");
    if(!abi || !logs) {
        return logs;
    }
    var decoders = abi.filter(function (json) {
        return json.type === 'event';
    }).map(function(json) {
        // note first and third params only required only by enocde and execute;
        // so don't call those!
        return new SolidityEvent(null, json, null);
        // return new  _web3.eth.contract(json);
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
}

function newWeb3Eth(_wsServer) {
    console.log('newWeb3Eth:',Web3Eth);
    return new Web3Eth(_wsServer);
}

