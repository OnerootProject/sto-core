var abiSTOFactory =[
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "name": "_sto",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_securityToken",
                "type": "address"
            }
        ],
        "name": "CreateSTO",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_securityToken",
                "type": "address"
            },
            {
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "name": "_paused",
                "type": "bool"
            },
            {
                "name": "_addresses",
                "type": "address[]"
            },
            {
                "name": "_values",
                "type": "uint256[]"
            }
        ],
        "name": "create",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

(function(exports){

    exports.abiSTOFactory = abiSTOFactory;

}(typeof exports === 'undefined' ? this.share = {} : exports));
