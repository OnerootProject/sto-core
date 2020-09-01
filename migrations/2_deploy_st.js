const FileUtils = require('../utils/FileUtils')
const JsonUtils = require('../utils/JsonUtils')
const Web3Utils = require('../utils/Web3Utils')

const GeneralPolicy = artifacts.require('./policies/GeneralPolicy.sol')
const PolicyRegistry = artifacts.require('./PolicyRegistry.sol')
const RAC = artifacts.require('./RAC.sol')
const SecurityToken = artifacts.require('./SecurityToken.sol')
const GeneralSTO = artifacts.require('./stos/GeneralSTO.sol')
const GeneralSTOFactory = artifacts.require('./stos/GeneralSTOFactory.sol')
const STGFactory = artifacts.require('./STGFactory.sol')

var owner;
var iPolicyRegistry;
var iRAC;
var iGeneralPolicy;
var iSecurityToken;
var iGeneralSTO;
var iSTGFactory;
var iGeneralSTOFactory;
var address_zero = "0x0000000000000000000000000000000000000000";

module.exports = async function (deployer, network, accounts) {
    console.log('network:',network);
    owner = accounts[0];
    if(network == 'main') {
        deployProd(deployer);
    } else {
        deployDev(deployer);
    }

}

function deployProd(deployer) {
    return _deployPolicyRegistry(deployer).then(() => {
        return _deployRAC(deployer);
    }).then(() => {
        return _deploySTOFactory(deployer);
    }).then(() => {
        return _deploySTGFactory(deployer);
    }).then(() => {

        console.log('\n');
        console.log(`
    ----------------------- Contracts' address: ------------------------------------
    PolicyRegistry:                          ${iPolicyRegistry.address}
    RAC:                                     ${iRAC.address}
    STGFactory:                              ${iSTGFactory.address}
    GeneralSTOFactory:                       ${iGeneralSTOFactory.address}
    ---------------------------------------------------------------------------------
    `);
        console.log('\n');

    });
}

function deployDev(deployer) {
    return _deployPolicyRegistry(deployer).then(() => {
        return _deployRAC(deployer);
    }).then(() => {
        return _deploySTOFactory(deployer);
    }).then(() => {
        return _deploySTGFactory(deployer);
    }).then(() => {
        return _deploySecurityToken(deployer);
    }).then(() => {
        return _deployGeneralPolicy(deployer);
    }).then(() => {
        return _deployGeneralSTO(deployer);
    }).then(() => {

        console.log('\n');
        console.log(`
    ----------------------- Contracts' address: ------------------------------------
    PolicyRegistry:                          ${iPolicyRegistry.address}
    RAC:                                     ${iRAC.address}
    STGFactory:                              ${iSTGFactory.address}
    GeneralSTOFactory:                       ${iGeneralSTOFactory.address}
    SecurityToken:                           ${iSecurityToken.address}
    GeneralPolicy:                           ${iGeneralPolicy.address}
    GeneralSTO:                              ${iGeneralSTO.address}
    ---------------------------------------------------------------------------------
    `);
        console.log('\n');

        let configContent =`config = {
    contract: {
        PolicyRegistry: '${iPolicyRegistry.address}',
        RAC: '${iRAC.address}',
        STGFactory: '${iSTGFactory.address}',
        STOFactory: '${iGeneralSTOFactory.address}',
        ST: '${iSecurityToken.address}',
        GP: '${iGeneralPolicy.address}',
        STO: '${iGeneralSTO.address}'
    }
};
    `;

        generateCode(configContent);

    });
}

function _deployPolicyRegistry(deployer) {
    return deployer.deploy(PolicyRegistry, {from: owner}).then(() => {
        return PolicyRegistry.deployed();
    }).then((res) => {
        iPolicyRegistry = res;
        return deployer;
    });
}

function _deployRAC(deployer) {
    return deployer.deploy(RAC, {from: owner}).then(() => {
        return RAC.deployed();
    }).then((res) => {
        iRAC = res;
        return deployer;
    });
}

function _deploySTOFactory(deployer) {
    return deployer.deploy(GeneralSTOFactory, {from: owner}).then(() => {
        return GeneralSTOFactory.deployed();
    }).then((res) => {
        iGeneralSTOFactory = res;
        return deployer;
    });
}

function _deploySTGFactory(deployer) {
    return deployer.deploy(STGFactory, iPolicyRegistry.address, iRAC.address, iGeneralSTOFactory.address, {from: owner}).then(() => {
        return STGFactory.deployed();
    }).then((res) => {
        iSTGFactory = res;
        return deployer;
    });
}

function _deploySecurityToken(deployer) {
    return deployer.deploy(SecurityToken, owner,'R1 Security Token', 'R1ST', 18, 1, {from: owner}).then(() => {
        return SecurityToken.deployed();
    }).then((res) => {
        iSecurityToken = res;
        return deployer;
    });
}

function _deployGeneralPolicy(deployer) {
    return deployer.deploy(GeneralPolicy, iSecurityToken.address, {from: owner}).then((res) => {
        return GeneralPolicy.deployed();
    }).then((res) => {
        iGeneralPolicy = res;
        return deployer;
    });
}

function _deployGeneralSTO(deployer) {
    let addresses = [address_zero, owner];
    let _startTime = Math.floor(new Date().getTime()/1000);
    let _endTime = _startTime + 3600*24*30000;
    let _maxAmount = Web3Utils.setAmount(100000000, 18).toNumber();
    let _rate = 10;
    let _minInvestorAmount = Web3Utils.setAmount(1, 18).toNumber();
    let _maxInvestorAmount = Web3Utils.setAmount(10000, 18).toNumber();
    let _maxInvestors = 200;
    let _lockMonths = 12;
    let values = [_startTime, _endTime, _maxAmount, _rate, _minInvestorAmount, _maxInvestorAmount, _maxInvestors, _lockMonths];

    return deployer.deploy(GeneralSTO, iSecurityToken.address, '', false, addresses, values, {from: owner}).then((res) => {
        return GeneralSTO.deployed();
    }).then((res) => {
        iGeneralSTO = res;
        return deployer;
    });
}

function generateCode(configContent) {
    FileUtils.writeFile(__dirname+'/../doc/public/js/config.js', configContent);

    let contractJson = require('../build/contracts/SecurityToken');
    let abi = "var abiSecurityToken =" + JsonUtils.stringify(contractJson.abi) + ";";
    abi += "(function(exports){\n";
    abi += "    exports.abiSecurityToken = abiSecurityToken;\n";
    abi += "}(typeof exports === 'undefined' ? this.share = {} : exports));\n";
    FileUtils.writeFile(__dirname+'/../doc/public/vendors/oneroot/js/abiSecurityToken.js', abi);

    contractJson = require('../build/contracts/GeneralPolicy');
    abi = "var abiGP =" + JsonUtils.stringify(contractJson.abi) + ";";
    abi += "(function(exports){\n";
    abi += "    exports.abiGP = abiGP;\n";
    abi += "}(typeof exports === 'undefined' ? this.share = {} : exports));\n";
    FileUtils.writeFile(__dirname+'/../doc/public/vendors/oneroot/js/abiGP.js', abi);

    contractJson = require('../build/contracts/STGFactory');
    abi = "var abiSTGFactory =" + JsonUtils.stringify(contractJson.abi) + ";";
    abi += "(function(exports){\n";
    abi += "    exports.abiSTGFactory = abiSTGFactory;\n";
    abi += "}(typeof exports === 'undefined' ? this.share = {} : exports));\n";
    FileUtils.writeFile(__dirname+'/../doc/public/vendors/oneroot/js/abiSTGFactory.js', abi);

    contractJson = require('../build/contracts/GeneralSTO');
    abi = "var abiSTO =" + JsonUtils.stringify(contractJson.abi) + ";";
    abi += "(function(exports){\n";
    abi += "    exports.abiSTO = abiSTO;\n";
    abi += "}(typeof exports === 'undefined' ? this.share = {} : exports));\n";
    FileUtils.writeFile(__dirname+'/../doc/public/vendors/oneroot/js/abiSTO.js', abi);

    contractJson = require('../build/contracts/GeneralSTOFactory');
    abi = "var abiSTOFactory =" + JsonUtils.stringify(contractJson.abi) + ";";
    abi += "(function(exports){\n";
    abi += "    exports.abiSTOFactory = abiSTOFactory;\n";
    abi += "}(typeof exports === 'undefined' ? this.share = {} : exports));\n";
    FileUtils.writeFile(__dirname+'/../doc/public/vendors/oneroot/js/abiSTOFactory.js', abi);

    contractJson = require('../build/contracts/RAC');
    abi = "var abiRAC =" + JsonUtils.stringify(contractJson.abi) + ";";
    abi += "(function(exports){\n";
    abi += "    exports.abiRAC = abiRAC;\n";
    abi += "}(typeof exports === 'undefined' ? this.share = {} : exports));\n";
    FileUtils.writeFile(__dirname+'/../doc/public/vendors/oneroot/js/abiRAC.js', abi);


    contractJson = require('../build/contracts/PolicyRegistry');
    abi = "var abiPolicyRegistry =" + JsonUtils.stringify(contractJson.abi) + ";";
    abi += "(function(exports){\n";
    abi += "    exports.abiPolicyRegistry = abiPolicyRegistry;\n";
    abi += "}(typeof exports === 'undefined' ? this.share = {} : exports));\n";
    FileUtils.writeFile(__dirname+'/../doc/public/vendors/oneroot/js/abiPolicyRegistry.js', abi);
}
