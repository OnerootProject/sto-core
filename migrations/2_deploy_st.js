const FileUtils = require('../utils/FileUtils')
const JsonUtils = require('../utils/JsonUtils')
const Web3Utils = require('../utils/Web3Utils')

const GeneralPolicy = artifacts.require('./policies/GeneralPolicy.sol')
const PolicyRegistry = artifacts.require('./PolicyRegistry.sol')
const RAC = artifacts.require('./RAC.sol')
const SecurityToken = artifacts.require('./SecurityToken.sol')
const DefaultSTO = artifacts.require('./stos/DefaultSTO.sol')
const STGFactory = artifacts.require('./STGFactory.sol')
const DefaultSTOFactory = artifacts.require('./DefaultSTOFactory.sol')



module.exports = async function (deployer, network, accounts) {
    console.log('network:',network);
    if(network != 'main') {
        deployDev(deployer, network, accounts);
    }

}

function deployDevToken(deployer, network, accounts) {
    console.log('network:',network);
    return deployer.deploy(Token, {from: accounts[0]}).then(function() {
        console.log('Token address:',Token.address);
    });
}

function deployDev(deployer, network, accounts) {
    console.log('deployDev...');
    // deployDevToken(deployer, network, accounts);

    let owner = accounts[0];
    let policyRegistry;
    let rac;
    let generalPolicy;
    let securityToken;
    let defaultSTO;
    let sTGFactory;
    let defaultSTOFactory;
    let address_zero = "0x0000000000000000000000000000000000000000";

    return deployer.deploy(PolicyRegistry, {from: owner}).then(() => {
        return PolicyRegistry.deployed();
    }).then((_policyRegistry) => {
        policyRegistry = _policyRegistry;
        return deployer.deploy(RAC, {from: owner});
    }).then((_rac) => {
        rac = _rac;
        return deployer.deploy(SecurityToken,owner,'R1 Security Token', 'R1ST', 18, 1, rac.address, {from: owner});
    }).then((_securityToken) => {
        securityToken = _securityToken;
        return deployer.deploy(STGFactory, policyRegistry.address, rac.address, {from: owner});
    }).then((_sTGFactory) => {
        sTGFactory = _sTGFactory;
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
        return deployer.deploy(DefaultSTO, securityToken.address, '', false, addresses, values, {from: owner});
    }).then((_defaultSTO) => {
        defaultSTO = _defaultSTO;
        return deployer.deploy(DefaultSTOFactory, rac.address, {from: owner});
    }).then((_defaultSTOFactory) => {
        defaultSTOFactory = _defaultSTOFactory;
        return deployer.deploy(GeneralPolicy, securityToken.address, {from: owner});
    }).then((_generalPolicy) => {
        generalPolicy = _generalPolicy;

        console.log('\n');
        console.log(`
    ----------------------- Contracts' address: ------------------------------------
    PolicyRegistry:                          ${policyRegistry.address}
    RAC:                                     ${rac.address}
    STGFactory:                              ${sTGFactory.address}
    DefaultSTOFactory:                       ${defaultSTOFactory.address}
    SecurityToken:                           ${securityToken.address}
    GeneralPolicy:                           ${generalPolicy.address}
    defaultSTO:                              ${defaultSTO.address}
    ---------------------------------------------------------------------------------
    `);
        console.log('\n');

        let configContent =`config = {
    contract: {
        PolicyRegistry: '${policyRegistry.address}',
        RAC: '${rac.address}',
        STGFactory: '${sTGFactory.address}',
        STOFactory: '${defaultSTOFactory.address}',
        ST: '${securityToken.address}',
        GP: '${generalPolicy.address}',
        STO: '${defaultSTO.address}'
    }
};
    `;

        generateCode(configContent);

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

    contractJson = require('../build/contracts/DefaultSTO');
    abi = "var abiSTO =" + JsonUtils.stringify(contractJson.abi) + ";";
    abi += "(function(exports){\n";
    abi += "    exports.abiSTO = abiSTO;\n";
    abi += "}(typeof exports === 'undefined' ? this.share = {} : exports));\n";
    FileUtils.writeFile(__dirname+'/../doc/public/vendors/oneroot/js/abiSTO.js', abi);

    contractJson = require('../build/contracts/DefaultSTOFactory');
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
}
