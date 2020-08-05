var abiGP =[
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "maxHolderCount",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "whitelist",
        "outputs": [
            {
                "name": "fromTime",
                "type": "uint256"
            },
            {
                "name": "toTime",
                "type": "uint256"
            },
            {
                "name": "expiryTime",
                "type": "uint256"
            },
            {
                "name": "canTransfer",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "version",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "maxHolderPercentage",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "securityToken",
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
                "name": "_securityToken",
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
                "indexed": false,
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "_investor",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_fromTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_toTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_expiryTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_canTransfer",
                "type": "bool"
            },
            {
                "indexed": false,
                "name": "_addedBy",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_timestamp",
                "type": "uint256"
            }
        ],
        "name": "ModifyWhitelist",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "_oldHolderCount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_newHolderCount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_oldHolderPercentage",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_newHolderPercentage",
                "type": "uint256"
            }
        ],
        "name": "ConfigHolder",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_name",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_errcode",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_errmsg",
                "type": "string"
            }
        ],
        "name": "Error",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_amount",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "checkTransfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_amount",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "checkMint",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_from",
                "type": "bytes32"
            },
            {
                "name": "_to",
                "type": "bytes32"
            },
            {
                "name": "_amount",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "checkChangeTranche",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "name": "_investor",
                "type": "address"
            },
            {
                "name": "_fromTime",
                "type": "uint256"
            },
            {
                "name": "_toTime",
                "type": "uint256"
            },
            {
                "name": "_expiryTime",
                "type": "uint256"
            },
            {
                "name": "_canTransfer",
                "type": "bool"
            }
        ],
        "name": "modifyWhitelist",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tranches",
                "type": "bytes32[]"
            },
            {
                "name": "_investors",
                "type": "address[]"
            },
            {
                "name": "_fromTimes",
                "type": "uint256[]"
            },
            {
                "name": "_toTimes",
                "type": "uint256[]"
            },
            {
                "name": "_expiryTimes",
                "type": "uint256[]"
            },
            {
                "name": "_canTransfer",
                "type": "bool[]"
            }
        ],
        "name": "batchModifyWhitelist",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "name": "_maxHolderCount",
                "type": "uint256"
            },
            {
                "name": "_maxHolderPercentage",
                "type": "uint256"
            }
        ],
        "name": "configHolder",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

(function(exports){

    exports.abiGP = abiGP;

}(typeof exports === 'undefined' ? this.share = {} : exports));
