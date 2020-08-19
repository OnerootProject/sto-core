var STOFactory = function (web3, param) {
    var factory = {
        web3 : web3,
        nonce: param['nonce'],
        gasPrice: param['gasPrice']? param['gasPrice'] : web3.toWei("5", "gwei"),
        gasLimit: 2455988,
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


    factory.create = function (securityToken, tranche, paused, addresses, values) {
        let txData = {
            data: factory.instance.create.getData(securityToken, tranche, paused, addresses, values)
        };
        return factory.sendTx(txData);
    };


    return factory;

};

(function(exports){

    exports.STOFactory = STOFactory;

}(typeof exports === 'undefined' ? this.share = {} : exports));
