var abiSTGFactory = [
    {
        "constant": true,
        "inputs": [],
        "name": "policyRegistry",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_policyRegistry",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_securityToken",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_symbol",
                "type": "string"
            },
            {
                "indexed": true,
                "name": "_policy",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_timestamp",
                "type": "uint256"
            }
        ],
        "name": "CreateSTG",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_name",
                "type": "string"
            },
            {
                "name": "_symbol",
                "type": "string"
            },
            {
                "name": "_decimals",
                "type": "uint8"
            },
            {
                "name": "_granularity",
                "type": "uint256"
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

    exports.abiSTGFactory = abiSTGFactory;

}(typeof exports === 'undefined' ? this.share = {} : exports));
