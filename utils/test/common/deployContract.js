const GeneralPolicy = artifacts.require('./policies/GeneralPolicy.sol')
const PolicyRegistry = artifacts.require('./PolicyRegistry.sol')
const RAC = artifacts.require('./RAC.sol')
const SecurityToken = artifacts.require('./SecurityToken.sol')
const DefaultSTO = artifacts.require('./stos/DefaultSTO.sol')

const STGFactory = artifacts.require('./STGFactory.sol')
const DefaultSTOFactory = artifacts.require('./DefaultSTOFactory.sol')

const roles = require('../../doc/public/vendors/oneroot/js/role')

// Contract Instance Declaration
let iPolicyRegistry;
let iRAC;
let iSecurityToken;
let iGeneralPolicy;
let iSTGFactory;
let iDefaultSTOFactory;

/// Function use to launch the security token ecossystem.

module.exports.deploy = async function deploy(owner) {
    await _deployPolicyRegistry(owner);
    await _deployRAC(owner);
    await _deploySecurityToken(owner);
    await _deployGeneralPolicy(owner);

    await iRAC.batchAddRole(owner, roles.roles, {from: owner});

    // Printing all the contract addresses
    console.log(`
        --------------------- Contracts: ---------------------
        PolicyRegistry:        ${iPolicyRegistry.address}
        RAC:                   ${iRAC.address}
        SecurityToken:         ${iSecurityToken.address}
        GeneralPolicy:         ${iGeneralPolicy.address}
        -----------------------------------------------------------------------------
        `);

    return {
        iGeneralPolicy: iGeneralPolicy,
        iPolicyRegistry: iPolicyRegistry,
        iSecurityToken: iSecurityToken,
        iRAC: iRAC
    }
}

module.exports.deployFactory = async function deploy(owner) {
    await _deployPolicyRegistry(owner);
    await _deployRAC(owner);
    await _deploySTGFactory(owner);
    await _deployDefaultSTOFactory(owner);

    await iRAC.batchAddRole(owner, roles.roles, {from: owner});
    await iRAC.addRole(iSTGFactory.address, 'registryPolicy', {from: owner});
    await iRAC.addRole(iDefaultSTOFactory.address, 'manageRole', {from: owner});

    // Printing all the contract addresses
    console.log(`
        --------------------- Contracts: ---------------------
        PolicyRegistry:        ${iPolicyRegistry.address}
        RAC:                   ${iRAC.address}
        STGFactory:            ${iSTGFactory.address}
        DefaultSTOFactory:     ${iDefaultSTOFactory.address}
        -----------------------------------------------------------------------------
        `);

    return {
        iPolicyRegistry: iPolicyRegistry,
        iSTGFactory: iSTGFactory,
        iDefaultSTOFactory: iDefaultSTOFactory,
        iRAC: iRAC
    }
}

module.exports.deploySecurityToken = async function deploySecurityToken(owner, param) {
    return await SecurityToken.new(param.issuer, param.name, param.symbol, param.decimals, param.granularity, param.policyRegistry, { from: owner });
}

module.exports.deployGeneralPolicy = async function deployGeneralPolicy(owner, param) {
    return await GeneralPolicy.new(param.name, param.symbol, param.decimals, param.granularity, param.policyRegistry, { from: owner });
}

module.exports.deployDefaultSTO = async function deployDefaultSTO(owner, securityToken) {
    var _tranche = '';
    var _paused = false;
    var now = Math.floor(new Date().getTime()/1000);
    var _startTime = now;
    var _endTime = now+3600*24*30;
    var _maxAmount = web3.toWei(1000000,'ether');
    var _rate = 10;
    var _minInvestorAmount = web3.toWei(1,'ether');
    var _maxInvestorAmount = web3.toWei(1000000,'ether');
    var _maxInvestors = 200;
    var _lockMonths = 12;
    var _fundRaiseToken = '0x0000000000000000000000000000000000000000';
    var _fundsReceiver = owner;

    var addresses = [_fundRaiseToken, _fundsReceiver];
    var values = [_startTime, _endTime, _maxAmount, _rate, _minInvestorAmount, _maxInvestorAmount, _maxInvestors, _lockMonths]

    return await DefaultSTO.new(securityToken,_tranche,_paused,addresses,values, { from: owner });
}


async function _deployPolicyRegistry(owner) {
    // Step 1
    iPolicyRegistry = await PolicyRegistry.new({ from: owner });
}

async function _deployRAC(owner) {
    // Step 1
    iRAC = await RAC.new({ from: owner });
}

async function _deploySecurityToken(owner) {
    // Step 2
    iSecurityToken = await SecurityToken.new(owner, 'R1 Security Token', 'R1ST', 18, 1,iRAC.address, {
        from: owner
    });
}

async function _deployGeneralPolicy(owner) {
    // Step 3
    iGeneralPolicy = await GeneralPolicy.new(iSecurityToken.address, { from: owner });
}

async function _deploySTGFactory(owner) {
    iSTGFactory = await STGFactory.new(iPolicyRegistry.address, iRAC.address, { from: owner });
}

async function _deployDefaultSTOFactory(owner) {
    iDefaultSTOFactory = await DefaultSTOFactory.new(iRAC.address, {from: owner});
}

async function _registry(owner) {
    await iSecurityToken.registryPolicy('', iGeneralPolicy.address, {from: owner});
}
