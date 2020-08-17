var EventStorageHelper = function () {
    var factory = {
        _PREFIX: 'EX-',
        _handleEx: null,
        _isHandle: false,
        etime: 1000,
        callback: null
    };

    factory.set = function(_data) {
        var _bn = new BigNumber(_data.logIndex);
        var _k = _data.transactionHash+_bn.toString(16);
        localStorage.setItem(factory._PREFIX+_k, JSON.stringify(_data));
        // console.log('get:', localStorage.getItem(factory._PREFIX+_k));
    };

    factory.ok = function(_data) {
        // console.log('_data:', _data);
        if(typeof _data != 'object') {
            factory._isHandle = false;
            return;
        }
        var _bn = new BigNumber(_data.logIndex);
        var _k = _data.transactionHash+_bn.toString(16);
        console.log('removeItem:', factory._PREFIX+_k);
        localStorage.removeItem(factory._PREFIX+_k);
        factory._isHandle = false;
    };

    factory.process = function() {
        console.log('isHandle:', factory._isHandle);
        console.log('localStorage.length:', localStorage.length);
        if(factory._isHandle) {
            return;
        }
        if(!factory.callback) {
            console.error('must be set callback function!!!');
            return;
        }
        for(var _i=0; _i<localStorage.length; _i++) {
            if(localStorage.key(_i) === null) {
                break;
            }
            if(factory._PREFIX == localStorage.key(_i).substring(0,3)) {
                // console.log(localStorage.key(_i), localStorage.getItem(localStorage.key(_i)));
                var _val = localStorage.getItem(localStorage.key(_i));
                try {
                    _val = JSON.parse(_val);
                } catch (e) {

                }
                factory._isHandle = true;
                factory.callback(_val);
                break;
            }

        }

        setTimeout(factory.process, factory.etime);
    };

    return factory;

};

(function(exports){

    exports.EventStorageHelper = EventStorageHelper;

}(typeof exports === 'undefined' ? this.share = {} : exports));
