var TxHelper = function (web3, _prefix='') {
    var factory = new StorageHelper('STOTX'+_prefix+'-');
    factory._isHandle = false;
    factory.etime = 10000;
    factory.processCallback = null;


    factory.processOK = function(_tx) {
        console.log('processOK:', _tx);
        if(! _tx) {
            factory._isHandle = false;
            return;
        }

        factory.remove(_tx);
        factory._isHandle = false;
    };

    factory.process = function() {
        if(factory._isHandle) {
            return;
        }
        if(!factory.processCallback) {
            console.error('must be set processCallback function!!!');
            return;
        }


        var _tx = null;
        for(var _i=0; _i<localStorage.length; _i++) {
            if(localStorage.key(_i) === null) {
                continue;
            }
            if(factory._PREFIX == localStorage.key(_i).substring(0,factory._PREFIX.length)) {
                _tx = localStorage.key(_i).substring(factory._PREFIX.length);
                factory._isHandle = true;
                factory.processCallback(_tx);
                break;
            }

        }

        setTimeout(factory.process, factory.etime);
    };


    factory.watch = function() {
        for(var _i=0; _i<localStorage.length; _i++) {
            // console.log('watch:', localStorage.key(_i));
            if(factory._PREFIX == localStorage.key(_i).substring(0,factory._PREFIX.length)) {
                var _tx = localStorage.key(_i).substring(factory._PREFIX.length);
                console.log('watch tx:', _tx);
                factory.getTransactionReceipt(_tx);
                break;
            }
        }

        setTimeout(factory.watch, factory.etime);
    };

    factory.getTransactionReceipt = function(tx) {
        web3.eth.getTransactionReceipt(tx, (error, result) => {
            if (error) {
                //nothing
            } else {
                console.log('Receipt:', result);
                factory.processOK(result);
            }
        });
    };

    return factory;

};
// dont override global variable
if (typeof window !== 'undefined' && typeof window.TxHelper === 'undefined') {
    window.TxHelper = TxHelper;
}
(function(exports){

    exports.TxHelper = TxHelper;

}(typeof exports === 'undefined' ? this.share = {} : exports));
