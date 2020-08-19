var SecurityToken = function (web3, param) {
    var factory = {
        web3 : web3,
        nonce: param['nonce'],
        gasPrice: param['gasPrice']? param['gasPrice'] : web3.toWei("5", "gwei"),
        gasLimit: 500000,
        addr: param['address'],
        instance: web3.eth.contract(param['abi']).at(param['address']),
        sender: param['sender']
    };

    factory.debug = function() {
        console.log('instance:', factory.instance);
    };

    factory.contract = function(address, abi) {
        factory.instance = web3.eth.contract(abi).at(address);
    };

    /**
     * web3.eth.sendTransaction, with default values, overwritted by passed params
     **/
    factory.sendTx = function (_txParams=null) {
        let txParams = {
            nonce: web3.toHex(factory.nonce),
            gas: web3.toHex(factory.gasLimit),
            gasPrice: web3.toHex(factory.gasPrice),
            to: factory.addr,
            from: factory.sender,
            value: '0x00',
            data: null
        };

        if(_txParams) {
            Object.assign(txParams, _txParams);
        }

        // let serializedTx = web3.toHex(txParams);
        console.log('txParams:',txParams);
        return new Promise((resolve, reject) => {
            web3.eth.sendTransaction(txParams, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            });
        });
    };

    /**
     * web3.eth.call, with default values, overwritted by passed params
     **/
    factory.callTx = function (_txParams=null) {
        let txParams = {
            to: factory.addr,
            from: factory.sender,
            data: null
        };
        if(_txParams) {
            Object.assign(txParams, _txParams);
        }

        return new Promise((resolve, reject) => {
            web3.eth.call(txParams, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            });
        });
    };

    factory.setNonce = function (nonce) {
        factory.nonce = nonce;
    };

    factory.setSender = function (address) {
        factory.sender = address;
    };

    factory.startTrans = function (address) {
        return new Promise((resolve, reject) => {
            web3.eth.getTransactionCount(address, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    factory.sender = address;
                    factory.nonce = result;
                    resolve(result);
                }
            });
        });
    };

    factory.balanceOf = function (owner) {
        let txData = {
            data: factory.instance.balanceOf.getData(owner)
        };

        return factory.callTx(txData);
    };

    factory.balanceOfTranche = function (tranche, owner) {
        // tranche = web3.padRight(web3.fromAscii(tranche),66);
        let txData = {
            data: factory.instance.balanceOfTranche.getData(tranche, owner)
        };

        return factory.callTx(txData);
    };


    factory.getPolicy = function (tranche='') {
        let txData = {
            data: factory.instance.getPolicy.getData(tranche)
        };

        return factory.callTx(txData);
    };

    factory.changePolicyRegistry = function (policyRegistry) {
        factory.gasLimit = 49284*2;
        let txData = {
            data: factory.instance.changePolicyRegistry.getData(policyRegistry)
        };
        return factory.sendTx(txData);
    };

    factory.registryPolicy = function (tranche, policy) {
        factory.gasLimit = 49284*2;
        let txData = {
            data: factory.instance.registryPolicy.getData(tranche, policy)
        };
        return factory.sendTx(txData);
    };

    factory.mint = function (investor, amount) {
        factory.gasLimit = 60000*4;
        let txData = {
            data: factory.instance.mint.getData(investor, amount)
        };
        return factory.sendTx(txData);
    };

    factory.batchMint = function (investors, amounts) {
        factory.gasLimit = 60000*4 * investors.length;
        let txData = {
            data: factory.instance.batchMint.getData(investors, amounts)
        };
        return factory.sendTx(txData);
    };

    factory.mintTranche = function (tranche, investor, amount) {
        factory.gasLimit = 60000*4;
        let txData = {
            data: factory.instance.mintTranche.getData(tranche, investor, amount, '')
        };
        return factory.sendTx(txData);
    };

    factory.batchMintTranche = function (tranche, investors, amounts) {
        factory.gasLimit = 60000*4 * investors.length;
        let txData = {
            data: factory.instance.batchMintTranche.getData(tranche, investors, amounts, '')
        };
        return factory.sendTx(txData);
    };

    factory.authorizeOperator = function (operator) {
        factory.gasLimit = 37408*2;
        let txData = {
            data: factory.instance.authorizeOperator.getData(operator)
        };
        return factory.sendTx(txData);
    };

    factory.approve = function (operator, value=1) {
        factory.gasLimit = 55183*2;
        let txData = {
            data: factory.instance.approve.getData(operator, value)
        };
        return factory.sendTx(txData);
    };


    return factory;

};


(function(exports){

    exports.SecurityToken = SecurityToken;

}(typeof exports === 'undefined' ? this.share = {} : exports));
