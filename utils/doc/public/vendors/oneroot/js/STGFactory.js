var STGFactory = function (web3, param) {
    var factory = new Web3Helper(web3, param);

    factory.create = function (issuer, name, symbol, decimals, granularity) {
        let txData = {
            data: factory.instance.create.getData(issuer, name, symbol, decimals, granularity)
        };
        return factory.sendTx(txData);
    };

    return factory;

};


(function(exports){

    exports.STGFactory = STGFactory;

}(typeof exports === 'undefined' ? this.share = {} : exports));
