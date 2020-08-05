const FileUtils = require('../utils/FileUtils')

const SecurityTokenPolicy = artifacts.require('./policies/GeneralPolicy.sol')
const PolicyRegistry = artifacts.require('./PolicyRegistry.sol')
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
    let securityTokenPolicy;
    let securityToken;
    let defaultSTO;
    let sTGFactory;
    let defaultSTOFactory;

    return deployer.deploy(PolicyRegistry, {from: owner}).then(() => {
        return PolicyRegistry.deployed();
    }).then((_policyRegistry) => {
        policyRegistry = _policyRegistry;
        return deployer.deploy(SecurityToken,'R1 Security Token', 'R1ST', 18, 1, policyRegistry.address, {from: owner});
    }).then((_securityToken) => {
        securityToken = _securityToken;
        return securityToken.changePolicyRegistry(policyRegistry.address, {from: owner});
    }).then(() => {
        return deployer.deploy(STGFactory, policyRegistry.address, {from: owner});
    }).then((_sTGFactory) => {
        sTGFactory = _sTGFactory;
        return deployer.deploy(DefaultSTO, securityToken.address, {from: owner});
    }).then((_defaultSTO) => {
        defaultSTO = _defaultSTO;
        return deployer.deploy(DefaultSTOFactory, {from: owner});
    }).then((_defaultSTOFactory) => {
        defaultSTOFactory = _defaultSTOFactory;
        return deployer.deploy(SecurityTokenPolicy, securityToken.address, {from: owner});
    }).then((_securityTokenPolicy) => {
        securityTokenPolicy = _securityTokenPolicy;
        return securityToken.registryPolicy('', securityTokenPolicy.address, {from: owner});
    }).then(() => {
        console.log('\n');
        console.log(`
    ----------------------- Contracts' address: -----------------------
    PolicyRegistry:                          ${policyRegistry.address}
    STGFactory:                              ${sTGFactory.address}
    DefaultSTOFactory:                       ${defaultSTOFactory.address}
    SecurityToken:                           ${securityToken.address}
    SecurityTokenPolicy:                     ${securityTokenPolicy.address}
    defaultSTO:                              ${defaultSTO.address}
    ---------------------------------------------------------------------------------
    `);
        console.log('\n');

        let configContent =`config = {
    contract: {
        PolicyRegistry: '${policyRegistry.address}',
        STGFactory: '${sTGFactory.address}',
        STOFactory: '${defaultSTOFactory.address}',
        ST: '${securityToken.address}',
        GP: '${securityTokenPolicy.address}',
        STO: '${defaultSTO.address}'
    }
};
    `;

        FileUtils.writeFile(__dirname+'/../doc/public/js/config.js', configContent);

    });
}

