var abiSecurityToken =[
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
        "inputs": [],
        "name": "totalSupply",
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
        "constant": true,
        "inputs": [],
        "name": "defaultTranche",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
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
        "inputs": [],
        "name": "granularity",
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
        "name": "symbol",
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
            },
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
                "name": "_owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
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
                "name": "_owner",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "Minted",
        "type": "event"
    },
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
                "name": "_owner",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "Burnt",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "tranche",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "SentTranche",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_operator",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "AuthorizedOperator",
        "type": "event"
    },
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
                "name": "_operator",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "AuthorizedOperatorTranche",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_operator",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "RevokedOperator",
        "type": "event"
    },
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
                "name": "_operator",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "RevokedOperatorTranche",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_old",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_new",
                "type": "uint256"
            }
        ],
        "name": "ChangeGranularity",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_old",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "_new",
                "type": "bytes32"
            }
        ],
        "name": "ChangeDefaultTranche",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_owner",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_old",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "_new",
                "type": "bytes32"
            }
        ],
        "name": "ChangeInvestorDefaultTranche",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_old",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_new",
                "type": "address"
            }
        ],
        "name": "ChangePolicyRegistry",
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
                "name": "_policy",
                "type": "address"
            }
        ],
        "name": "RegistryPolicy",
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
                "indexed": true,
                "name": "_operator",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_verifyTransfer",
                "type": "bool"
            },
            {
                "indexed": false,
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "ForceTransfer",
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
                "indexed": true,
                "name": "_operator",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_verifyTransfer",
                "type": "bool"
            },
            {
                "indexed": false,
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "ForceBurn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_owner",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_from",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "_to",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "ChangeTranche",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_policy",
                "type": "address"
            }
        ],
        "name": "changePolicyRegistry",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_tranche",
                "type": "bytes32"
            }
        ],
        "name": "getPolicy",
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
        "constant": false,
        "inputs": [
            {
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "name": "_policy",
                "type": "address"
            }
        ],
        "name": "registryPolicy",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_granularity",
                "type": "uint256"
            }
        ],
        "name": "changeGranularity",
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
            }
        ],
        "name": "changeDefaultTranche",
        "outputs": [],
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
                "name": "_tranche",
                "type": "bytes32"
            }
        ],
        "name": "changeInvestorDefaultTranche",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getDecimals",
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
        "inputs": [
            {
                "name": "_tranche",
                "type": "bytes32"
            }
        ],
        "name": "getTrancheTotalSupply",
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
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
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
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOfAll",
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
        "inputs": [
            {
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOfTranche",
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
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "getInvestorDefaultTranche",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
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
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "name": "_start",
                "type": "uint256"
            },
            {
                "name": "_end",
                "type": "uint256"
            }
        ],
        "name": "iterateInvestors",
        "outputs": [
            {
                "name": "",
                "type": "address[]"
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
                "name": "_tranche",
                "type": "bytes32"
            }
        ],
        "name": "getInvestorCount",
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
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "success",
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
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "sendTranche",
        "outputs": [
            {
                "name": "success",
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
                "type": "address[]"
            },
            {
                "name": "_values",
                "type": "uint256[]"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "batchSendTranche",
        "outputs": [
            {
                "name": "success",
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
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
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
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "operatorSendTranche",
        "outputs": [
            {
                "name": "success",
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
                "name": "_investor",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [
            {
                "name": "success",
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
                "name": "_investors",
                "type": "address[]"
            },
            {
                "name": "_values",
                "type": "uint256[]"
            }
        ],
        "name": "batchMint",
        "outputs": [
            {
                "name": "success",
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
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "mintTranche",
        "outputs": [
            {
                "name": "success",
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
                "name": "_investors",
                "type": "address[]"
            },
            {
                "name": "_values",
                "type": "uint256[]"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "batchMintTranche",
        "outputs": [
            {
                "name": "success",
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
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "burn",
        "outputs": [
            {
                "name": "success",
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
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "burnFrom",
        "outputs": [
            {
                "name": "success",
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
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "forceTransfer",
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
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "forceBurn",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "bytes32"
            },
            {
                "name": "_to",
                "type": "bytes32"
            },
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "changeTranche",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "tranchesOf",
        "outputs": [
            {
                "name": "",
                "type": "bytes32[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_operator",
                "type": "address"
            }
        ],
        "name": "authorizeOperator",
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
                "name": "_operator",
                "type": "address"
            }
        ],
        "name": "authorizeOperatorTranche",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_operator",
                "type": "address"
            }
        ],
        "name": "revokeOperator",
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
                "name": "_operator",
                "type": "address"
            }
        ],
        "name": "revokeOperatorTranche",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_operator",
                "type": "address"
            },
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "isOperatorFor",
        "outputs": [
            {
                "name": "",
                "type": "bool"
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
                "name": "_tranche",
                "type": "bytes32"
            },
            {
                "name": "_operator",
                "type": "address"
            },
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "isOperatorForTranche",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "spender",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
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
        "constant": true,
        "inputs": [
            {
                "name": "owner",
                "type": "address"
            },
            {
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

(function(exports){

    exports.abiSecurityToken = abiSecurityToken;

}(typeof exports === 'undefined' ? this.share = {} : exports));
